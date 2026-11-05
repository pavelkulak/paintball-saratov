import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'

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

if (process.versions.node !== '22.23.2') {
  fail(`Node.js 22.23.2 is required; found ${process.version}.`)
}

for (const path of [
  resolve(projectRoot, 'node_modules'),
  resolve(projectRoot, 'Dockerfile'),
  resolve(projectRoot, 'src', 'lib', 'bitrix', 'home.ts'),
  resolve(projectRoot, 'cms', 'local', 'api', 'home.php'),
]) {
  if (!existsSync(path)) fail(`Required path is missing: ${path}`)
}

const apiUrl = process.env.BITRIX_API_URL
if (apiUrl) {
  const response = await fetch(apiUrl, {
    signal: AbortSignal.timeout(10_000),
  }).catch(() => null)

  if (!response || !response.ok) {
    fail(`Bitrix endpoint did not respond successfully: ${apiUrl}.`)
  }
} else {
  console.log('[verify] BITRIX_API_URL is unset; skipping the endpoint check.')
}

run('npm', ['run', 'check'])
console.log('[verify] PASS; Next.js build and project checks completed.')
