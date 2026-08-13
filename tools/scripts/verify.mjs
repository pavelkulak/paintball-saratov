import { existsSync, readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import { runMcp } from '../bitrix-mcp/run.mjs'
import { projectRoot } from './project.mjs'

const expectedNode = '22.22.3'
const nodeExecutable = resolve(
  projectRoot,
  'tools',
  'node-runtime',
  process.platform === 'win32' ? 'node.exe' : 'node',
)
const legacyNodeExecutable = resolve(
  projectRoot,
  'node_modules',
  'node',
  'bin',
  process.platform === 'win32' ? 'node.exe' : 'node',
)
const nodeVersionCommand = existsSync(nodeExecutable)
  ? { command: nodeExecutable, args: [] }
  : existsSync(legacyNodeExecutable)
    ? { command: legacyNodeExecutable, args: [] }
    : {
        command: process.platform === 'win32' ? 'npx.cmd' : 'npx',
        args: ['--offline', '--package', `node@${expectedNode}`, 'node'],
      }

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

const nodeVersion = spawnSync(
  nodeVersionCommand.command,
  [...nodeVersionCommand.args, '--version'],
  {
    encoding: 'utf8',
    shell:
      process.platform === 'win32' &&
      nodeVersionCommand.command.endsWith('.cmd'),
  },
)
  .stdout?.trim()
  .replace(/^v/, '')
if (nodeVersion !== expectedNode) {
  fail(
    `Node.js ${expectedNode} is required; found ${nodeVersion ?? 'unknown'}.`,
  )
}

for (const path of [
  resolve(projectRoot, 'node_modules'),
  resolve(projectRoot, 'tools', 'bitrix-mcp', 'node_modules'),
  resolve(projectRoot, '.agents', 'skills', 'bitrix-mcp', 'SKILL.md'),
]) {
  if (!existsSync(path)) fail(`Required path is missing: ${path}`)
}

const docker = spawnSync(
  process.platform === 'win32' ? 'docker.exe' : 'docker',
  ['version'],
  { cwd: projectRoot, stdio: 'ignore' },
)
if (docker.status !== 0) fail('Docker Desktop is not available.')

const compose = spawnSync(
  process.platform === 'win32' ? 'docker.exe' : 'docker',
  ['compose', 'version'],
  { cwd: projectRoot, stdio: 'ignore' },
)
if (compose.status !== 0) fail('Docker Compose v2 is not available.')

const bitrixResponse = await fetch('http://localhost:8588/', {
  signal: AbortSignal.timeout(5000),
}).catch(() => null)
if (!bitrixResponse || !bitrixResponse.ok) {
  fail('Bitrix did not respond successfully at http://localhost:8588/.')
}

const snapshotRoot = resolve(projectRoot, 'infra', 'bitrix-site')
const metadataPath = resolve(snapshotRoot, '.bitrix-snapshot.json')
if (!existsSync(resolve(snapshotRoot, 'bitrix')) || !existsSync(metadataPath)) {
  fail('Bitrix snapshot is missing. Run npm run bitrix:snapshot.')
}

const metadata = JSON.parse(readFileSync(metadataPath, 'utf8'))
if (!metadata.createdAt)
  fail('Bitrix snapshot metadata has no createdAt timestamp.')

runMcp(['doctor', '--verbose'])
const status = runCaptureMcp(['status'])
const bitrixCount = Number(
  status.match(/by scope:.*\bbitrix\s+(\d+)/i)?.[1] ?? 0,
)
if (bitrixCount <= 0) fail('MCP Bitrix index is empty.')

run('npm', ['run', 'check'])
console.log(`[verify] PASS; Bitrix snapshot: ${metadata.createdAt}`)
