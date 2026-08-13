import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import { mcpEnvironment, runMcp } from '../bitrix-mcp/run.mjs'
import { projectRoot } from './project.mjs'

function fail(message) {
  throw new Error(`[verify] ${message}`)
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })

  if (result.error) throw result.error
  if (result.status !== 0) fail(`${command} ${args.join(' ')} failed.`)
}

function runCaptureMcp(args) {
  const result = runMcp(args, { stdio: 'pipe' })
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`
  process.stdout.write(output)
  if (result.status !== 0) fail(`MCP ${args.join(' ')} failed.`)
  return output
}

const [major, minor] = process.versions.node.split('.').map(Number)
if (major < 22 || (major === 22 && minor < 12)) {
  fail(`Node.js 22.12 or newer is required; found ${process.version}.`)
}

const environment = mcpEnvironment()
const bitrixRoot = environment.BITRIX_ROOT
const phpBin = environment.BITRIX_MCP_PHP_BIN
const apiUrl = environment.BITRIX_API_URL

for (const path of [
  resolve(projectRoot, 'node_modules'),
  resolve(projectRoot, 'tools', 'bitrix-mcp', 'node_modules'),
  resolve(projectRoot, '.agents', 'skills', 'bitrix-mcp', 'SKILL.md'),
  resolve(projectRoot, 'cms', 'local', 'api', 'home.php'),
]) {
  if (!existsSync(path)) fail(`Required path is missing: ${path}`)
}

if (!bitrixRoot || !existsSync(resolve(bitrixRoot, 'bitrix'))) {
  fail(`Bitrix root is unavailable: ${bitrixRoot ?? 'BITRIX_ROOT is not set'}.`)
}

if (
  !existsSync(
    resolve(
      bitrixRoot,
      'bitrix',
      'modules',
      'main',
      'include',
      'prolog_before.php',
    ),
  )
) {
  fail(`Bitrix core is incomplete under ${bitrixRoot}.`)
}

if (!phpBin || !existsSync(phpBin)) {
  fail(
    `OSPanel PHP CLI is unavailable: ${phpBin || 'BITRIX_MCP_PHP_BIN is not set'}.`,
  )
}

run(phpBin, ['-v'])

if (apiUrl) {
  const response = await fetch(apiUrl, {
    signal: AbortSignal.timeout(5000),
  }).catch(() => null)
  if (!response || !response.ok) {
    fail(`Bitrix endpoint did not respond successfully: ${apiUrl}.`)
  }
}

runMcp(['doctor', '--verbose'])
const status = runCaptureMcp(['status'])
if (/files\s*:\s*0|symbols\s*:\s*0/i.test(status)) {
  fail('MCP index is empty.')
}

run('npm', ['run', 'check'])
console.log(`[verify] PASS; Bitrix root: ${bitrixRoot}`)
