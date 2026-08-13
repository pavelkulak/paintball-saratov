import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const runtimeRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const requiredNodeVersion = '22.22.3'
const projectNode = resolve(
  runtimeRoot,
  'tools',
  'node-runtime',
  process.platform === 'win32' ? 'node.exe' : 'node',
)
const legacyProjectNode = resolve(
  runtimeRoot,
  'node_modules',
  'node',
  'bin',
  process.platform === 'win32' ? 'node.exe' : 'node',
)
const nodeExecutable = existsSync(projectNode)
  ? projectNode
  : existsSync(legacyProjectNode)
    ? legacyProjectNode
    : process.execPath
const nodeCommand =
  existsSync(projectNode) || existsSync(legacyProjectNode)
    ? { command: nodeExecutable, prefix: [], shell: false }
    : {
        command: process.platform === 'win32' ? 'npx.cmd' : 'npx',
        prefix: [
          '--offline',
          '--package',
          `node@${requiredNodeVersion}`,
          'node',
        ],
        shell: process.platform === 'win32',
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
const snapshotRoot = resolve(runtimeRoot, 'infra', 'bitrix-site')

export function mcpEnvironment() {
  const environment = {
    ...process.env,
    BITRIX_MCP_WORKSPACE: process.env.BITRIX_MCP_WORKSPACE ?? runtimeRoot,
    BITRIX_MCP_DATA_DIR:
      process.env.BITRIX_MCP_DATA_DIR ?? resolve(runtimeRoot, '.bitrix-mcp'),
    BITRIX_MCP_DOCS_DIR:
      process.env.BITRIX_MCP_DOCS_DIR ?? resolve(runtimeRoot, 'docs'),
    BITRIX_MCP_SEMANTIC_ENABLED: process.env.BITRIX_MCP_SEMANTIC_ENABLED ?? '0',
    BITRIX_MCP_OFFICIAL_DOCS_ENABLED:
      process.env.BITRIX_MCP_OFFICIAL_DOCS_ENABLED ?? '1',
    BITRIX_MCP_DB_ENABLED: process.env.BITRIX_MCP_DB_ENABLED ?? '1',
    BITRIX_MCP_DB_ALLOW_WRITE: '0',
    BITRIX_MCP_TINKER_ENABLED: '0',
  }

  if (!environment.BITRIX_ROOT && existsSync(resolve(snapshotRoot, 'bitrix'))) {
    environment.BITRIX_ROOT = snapshotRoot
  }

  return environment
}

export function runMcp(args, options = {}) {
  const result = spawnSync(
    nodeCommand.command,
    [...nodeCommand.prefix, '--experimental-sqlite', cliPath, ...args],
    {
      cwd: runtimeRoot,
      env: mcpEnvironment(),
      stdio: options.stdio ?? 'inherit',
      encoding: 'utf8',
      shell: nodeCommand.shell,
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
