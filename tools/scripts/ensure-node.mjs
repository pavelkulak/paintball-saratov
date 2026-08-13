import {
  copyFileSync,
  existsSync,
  mkdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import { projectRoot } from './project.mjs'

const version = '22.22.3'
const runtimeRoot = resolve(projectRoot, 'tools', 'node-runtime')
const runtimeBinary = resolve(
  runtimeRoot,
  process.platform === 'win32' ? 'node.exe' : 'node',
)
const installRoot = resolve(projectRoot, 'tools', '.node-install')
const installedBinary = resolve(
  installRoot,
  'node_modules',
  'node',
  'bin',
  process.platform === 'win32' ? 'node.exe' : 'node',
)

function nodeVersion(binary) {
  const result = spawnSync(binary, ['--version'], { encoding: 'utf8' })
  return result.status === 0 ? result.stdout.trim().replace(/^v/, '') : null
}

if (existsSync(runtimeBinary) && nodeVersion(runtimeBinary) === version) {
  console.log(`Node.js runtime ready: ${runtimeBinary}`)
  process.exit(0)
}

rmSync(installRoot, { recursive: true, force: true })
mkdirSync(installRoot, { recursive: true })
writeFileSync(
  resolve(installRoot, 'package.json'),
  `${JSON.stringify({ private: true })}\n`,
)

const install = spawnSync(
  process.platform === 'win32' ? 'npm.cmd' : 'npm',
  ['install', '--no-package-lock', '--no-save', `node@${version}`],
  {
    cwd: installRoot,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  },
)

if (install.status !== 0 || !existsSync(installedBinary)) {
  throw new Error(`Could not install Node.js ${version} runtime.`)
}

mkdirSync(runtimeRoot, { recursive: true })
copyFileSync(installedBinary, runtimeBinary)
rmSync(installRoot, { recursive: true, force: true })

if (nodeVersion(runtimeBinary) !== version) {
  throw new Error(`Installed Node.js runtime is not ${version}.`)
}

console.log(`Node.js runtime ready: ${runtimeBinary}`)
