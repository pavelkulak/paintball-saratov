import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { projectRoot } from './project.mjs'

const composeRoot = resolve(projectRoot, 'infra', 'bitrix')
const composeFile = resolve(composeRoot, 'docker-compose.yml')
const args = process.argv.slice(2)

if (!existsSync(composeFile)) {
  throw new Error(`Bitrix Docker environment is missing: ${composeFile}`)
}

const result = spawnSync(
  process.platform === 'win32' ? 'docker.exe' : 'docker',
  ['compose', '-f', composeFile, ...args],
  { cwd: composeRoot, stdio: 'inherit' },
)

if (result.error) {
  throw result.error
}

process.exit(result.status ?? 1)
