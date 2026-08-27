import { existsSync, rmSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { resolve } from 'node:path'
import { projectRoot } from './project.mjs'

const extraArgs = process.argv
  .slice(2)
  .filter((argument) => argument !== '--clean')
const shouldClean = process.argv.slice(2).includes('--clean')

const nextCache = resolve(projectRoot, '.next')
if (shouldClean && existsSync(nextCache)) {
  rmSync(nextCache, { recursive: true, force: true })
  console.log('Removed .next cache.')
}

const nextBinary = resolve(
  projectRoot,
  'node_modules/.bin',
  process.platform === 'win32' ? 'next.cmd' : 'next',
)

const child = spawn(nextBinary, ['dev', '--webpack', ...extraArgs], {
  cwd: projectRoot,
  env: {
    ...process.env,
    WATCHPACK_POLLING: 'true',
  },
  stdio: 'inherit',
  shell: process.platform === 'win32',
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 0)
})
