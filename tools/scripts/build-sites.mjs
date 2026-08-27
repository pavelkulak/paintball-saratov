import { cp, mkdir, rm, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { relative, resolve } from 'node:path'

import { projectRoot } from './project.mjs'

const outputRoot = resolve(projectRoot, 'out')
const distRoot = resolve(projectRoot, 'dist')
const clientRoot = resolve(distRoot, 'client')
const serverRoot = resolve(distRoot, 'server')
const hostingConfig = resolve(projectRoot, '.openai', 'hosting.json')

function assertProjectPath(path) {
  const relativePath = relative(projectRoot, path)

  if (relativePath.startsWith('..') || relativePath === '') {
    throw new Error(`Refusing to modify a path outside the project: ${path}`)
  }
}

const nextBinary = resolve(
  projectRoot,
  'node_modules/.bin',
  process.platform === 'win32' ? 'next.cmd' : 'next',
)
const build = spawnSync(nextBinary, ['build'], {
  cwd: projectRoot,
  env: { ...process.env, CONTENT_SOURCE: 'demo' },
  stdio: 'inherit',
  shell: process.platform === 'win32',
})

if (build.error) throw build.error
if (build.status !== 0) throw new Error('The static demo build failed.')

assertProjectPath(distRoot)
await rm(distRoot, { recursive: true, force: true })
await mkdir(serverRoot, { recursive: true })
await cp(outputRoot, clientRoot, { recursive: true })
await mkdir(resolve(distRoot, '.openai'), { recursive: true })
await cp(hostingConfig, resolve(distRoot, '.openai', 'hosting.json'))

const worker = `async function fetchAsset(request, env, pathname) {
  const url = new URL(request.url)
  url.pathname = pathname
  return env.ASSETS.fetch(new Request(url, request))
}

export default {
  async fetch(request, env) {
    if (!env.ASSETS) {
      return new Response('Sites asset binding is unavailable.', { status: 500 })
    }

    const url = new URL(request.url)
    const pathname = decodeURIComponent(url.pathname)
    const candidates = pathname.endsWith('/')
      ? [pathname + 'index.html']
      : [pathname, pathname + '/index.html']

    for (const candidate of candidates) {
      const response = await fetchAsset(request, env, candidate)
      if (response.ok) return response
    }

    const notFound = await fetchAsset(request, env, '/404.html')
    return new Response(notFound.body, {
      status: 404,
      headers: notFound.headers,
    })
  },
}
`

await writeFile(resolve(serverRoot, 'index.js'), worker)
await writeFile(
  resolve(serverRoot, 'wrangler.json'),
  JSON.stringify(
    {
      main: 'index.js',
      compatibility_date: '2026-08-25',
      assets: {
        binding: 'ASSETS',
        directory: '../client',
      },
    },
    null,
    2,
  ),
)

console.log(`Sites bundle: ${distRoot}`)
