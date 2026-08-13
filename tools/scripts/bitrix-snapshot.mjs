import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { runMcp } from '../bitrix-mcp/run.mjs'
import { projectRoot } from './project.mjs'

const container = process.env.BITRIX_CONTAINER ?? 'dev_php'
const snapshotRoot = resolve(projectRoot, 'infra', 'bitrix-site')
const metadataPath = resolve(snapshotRoot, '.bitrix-snapshot.json')

const inspect = spawnSync(
  process.platform === 'win32' ? 'docker.exe' : 'docker',
  ['inspect', '--format={{.State.Running}}', container],
  { encoding: 'utf8' },
)

if (inspect.status !== 0 || inspect.stdout.trim() !== 'true') {
  throw new Error(
    `Bitrix PHP container '${container}' is not running. Run 'npm run bitrix:up' first.`,
  )
}

rmSync(snapshotRoot, { recursive: true, force: true })
mkdirSync(snapshotRoot, { recursive: true })

const copy = spawnSync(
  process.platform === 'win32' ? 'docker.exe' : 'docker',
  ['cp', `${container}:/opt/www/.`, snapshotRoot],
  { cwd: projectRoot, stdio: 'inherit' },
)

if (copy.status !== 0) {
  throw new Error('Could not copy /opt/www from the Bitrix PHP container.')
}

if (!existsSync(resolve(snapshotRoot, 'bitrix'))) {
  throw new Error(
    `Snapshot was copied, but the Bitrix root is missing: ${resolve(snapshotRoot, 'bitrix')}`,
  )
}

writeFileSync(
  metadataPath,
  `${JSON.stringify(
    {
      createdAt: new Date().toISOString(),
      sourceContainer: container,
      sourcePath: '/opt/www',
      bitrixRoot: snapshotRoot,
    },
    null,
    2,
  )}\n`,
)

console.log(`Bitrix snapshot created: ${snapshotRoot}`)
console.log(`Snapshot metadata: ${metadataPath}`)

const index = runMcp(['index-all', '--no-progress'])
process.exit(index.status ?? 1)
