import { existsSync, readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const runtimeRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const requiredNodeVersion = '22.22.3'
if (process.versions.node !== requiredNodeVersion) {
  throw new Error(
    `Bitrix MCP requires system Node.js ${requiredNodeVersion}; found ${process.version}.`,
  )
}
const cliPath = resolve(
  runtimeRoot,
  'tools',
  'bitrix-mcp',
  'node_modules',
  '@mb4it',
  'bitrix-mcp',
  'dist',
  'cli.js',
)

function loadLocalEnv() {
  const envPath = resolve(runtimeRoot, '.env.local')
  if (!existsSync(envPath)) return {}

  return Object.fromEntries(
    readFileSync(envPath, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.match(/^\s*([A-Z0-9_]+)=(.*)\s*$/))
      .filter(Boolean)
      .map((match) => [match[1], match[2].replace(/^['"]|['"]$/g, '')]),
  )
}

function resolveConfiguredPath(value, fallback) {
  if (!value) return fallback
  return /^[A-Za-z]:[\\/]|^\\\\/.test(value)
    ? value
    : resolve(runtimeRoot, value)
}

export function mcpEnvironment() {
  const localEnv = loadLocalEnv()
  const environment = {
    ...localEnv,
    ...process.env,
    BITRIX_MCP_WORKSPACE: resolveConfiguredPath(
      process.env.BITRIX_MCP_WORKSPACE ?? localEnv.BITRIX_MCP_WORKSPACE,
      runtimeRoot,
    ),
    BITRIX_MCP_DATA_DIR: resolveConfiguredPath(
      process.env.BITRIX_MCP_DATA_DIR ?? localEnv.BITRIX_MCP_DATA_DIR,
      resolve(runtimeRoot, '.bitrix-mcp'),
    ),
    BITRIX_MCP_DOCS_DIR:
      process.env.BITRIX_MCP_DOCS_DIR ??
      localEnv.BITRIX_MCP_DOCS_DIR ??
      resolve(runtimeRoot, 'docs'),
    BITRIX_MCP_SEMANTIC_ENABLED:
      process.env.BITRIX_MCP_SEMANTIC_ENABLED ??
      localEnv.BITRIX_MCP_SEMANTIC_ENABLED ??
      '0',
    BITRIX_MCP_OFFICIAL_DOCS_ENABLED:
      process.env.BITRIX_MCP_OFFICIAL_DOCS_ENABLED ??
      localEnv.BITRIX_MCP_OFFICIAL_DOCS_ENABLED ??
      '1',
    BITRIX_MCP_DB_ENABLED:
      process.env.BITRIX_MCP_DB_ENABLED ??
      localEnv.BITRIX_MCP_DB_ENABLED ??
      '1',
    BITRIX_ROOT: resolveConfiguredPath(
      process.env.BITRIX_ROOT ?? localEnv.BITRIX_ROOT,
      resolve(runtimeRoot, 'cms'),
    ),
    BITRIX_MCP_PHP_BIN: resolveConfiguredPath(
      process.env.BITRIX_MCP_PHP_BIN ?? localEnv.BITRIX_MCP_PHP_BIN,
      '',
    ),
    BITRIX_MCP_DB_ALLOW_WRITE: '0',
    BITRIX_MCP_TINKER_ENABLED:
      process.env.BITRIX_MCP_TINKER_ENABLED ??
      localEnv.BITRIX_MCP_TINKER_ENABLED ??
      '0',
  }

  return environment
}

export function runMcp(args, options = {}) {
  const result = spawnSync(
    process.execPath,
    ['--experimental-sqlite', cliPath, ...args],
    {
      cwd: runtimeRoot,
      env: mcpEnvironment(),
      stdio: options.stdio ?? 'inherit',
      encoding: 'utf8',
      shell: false,
    },
  )

  if (result.error) {
    throw result.error
  }

  return result
}

if (
  resolve(process.argv[1] ?? '') === resolve(fileURLToPath(import.meta.url))
) {
  const result = runMcp(process.argv.slice(2))
  process.exit(result.status ?? 1)
}
