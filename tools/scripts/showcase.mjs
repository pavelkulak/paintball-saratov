import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, relative, resolve } from 'node:path'

import { projectRoot } from './project.mjs'

const root = resolve(projectRoot, 'out')
const port = Number(process.env.SHOWCASE_PORT ?? 3005)
const clientScript = readFileSync(
  resolve(projectRoot, 'tools/scripts/showcase-scroll.js'),
)
let status = { phase: 'idle' }
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
}

if (!existsSync(join(root, 'index.html'))) {
  throw new Error('Run npm run build before starting the showcase server.')
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://localhost:${port}`)
    response.setHeader('Cache-Control', 'no-store')

    if (url.pathname === '/__showcase__/status') {
      if (request.method === 'POST') {
        if (request.headers.origin !== `http://localhost:${port}`) {
          response.writeHead(403).end()
          return
        }
        let body = ''
        for await (const chunk of request) {
          body += chunk
          if (body.length > 4096) {
            response.writeHead(413).end()
            return
          }
        }
        status = { ...JSON.parse(body), updatedAt: new Date().toISOString() }
        console.log(JSON.stringify(status))
      }
      response.setHeader('Content-Type', 'application/json')
      response.end(JSON.stringify(status))
      return
    }

    if (url.pathname === '/__showcase__/scroll.js') {
      response.setHeader('Content-Type', types['.js'])
      response.end(clientScript)
      return
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405).end()
      return
    }

    let path = resolve(root, '.' + decodeURIComponent(url.pathname))
    const localPath = relative(root, path)
    if (localPath.startsWith('..') || localPath.includes(':')) {
      response.writeHead(403).end()
      return
    }
    if (existsSync(path) && statSync(path).isDirectory()) {
      path = join(path, 'index.html')
    }
    if (!existsSync(path) || !statSync(path).isFile()) {
      response.writeHead(404).end('Not found')
      return
    }

    response.setHeader(
      'Content-Type',
      types[extname(path)] ?? 'application/octet-stream',
    )
    if (path === join(root, 'index.html')) {
      const html = readFileSync(path, 'utf8')
        .replace(/<title>.*?<\/title>/, '<title>Paintball Showcase</title>')
        .replace(
          '</body>',
          '<script src="/__showcase__/scroll.js"></script></body>',
        )
      response.end(request.method === 'HEAD' ? undefined : html)
      return
    }

    const size = statSync(path).size
    response.setHeader('Accept-Ranges', 'bytes')
    const range = request.headers.range?.match(/^bytes=(\d+)-(\d*)$/)
    const start = range ? Number(range[1]) : 0
    const end = range?.[2] ? Math.min(Number(range[2]), size - 1) : size - 1
    if (start > end || start >= size) {
      response.setHeader('Content-Range', `bytes */${size}`)
      response.writeHead(416).end()
      return
    }
    response.setHeader('Content-Length', end - start + 1)
    if (range) {
      response.setHeader('Content-Range', `bytes ${start}-${end}/${size}`)
      response.statusCode = 206
    }
    if (request.method === 'HEAD') {
      response.end()
      return
    }
    const stream = createReadStream(path, { start, end })
    response.on('close', () => stream.destroy())
    stream.on('error', () => response.destroy())
    stream.pipe(response)
  } catch (error) {
    console.error(error.message)
    if (!response.headersSent) response.writeHead(400)
    response.end('Invalid request')
  }
})

server.listen(port, '127.0.0.1', () => {
  console.log(`Showcase: http://localhost:${port}/`)
  console.log(
    'Start recording, then open /?run=1&duration=48 to include the loader.',
  )
  console.log('Space: start again. Escape: stop. Status: /__showcase__/status')
})
