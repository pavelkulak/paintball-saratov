import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'
import { projectRoot } from './project.mjs'

const outputRoot = resolve(projectRoot, 'out')
const port = Number(process.env.PORT ?? 3000)
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

if (!existsSync(outputRoot)) {
  throw new Error(
    `Static output is missing: ${outputRoot}. Run 'npm run build' first.`,
  )
}

const server = createServer((request, response) => {
  const requestPath = decodeURIComponent(request.url?.split('?')[0] ?? '/')
  const relativePath = normalize(requestPath).replace(/^([.][.][\\/])+/, '')
  let filePath = resolve(outputRoot, `.${relativePath}`)

  if (!filePath.startsWith(outputRoot)) {
    response.writeHead(403)
    response.end('Forbidden')
    return
  }

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, 'index.html')
  }

  if (!existsSync(filePath)) {
    response.writeHead(404)
    response.end('Not found')
    return
  }

  response.writeHead(200, {
    'Content-Type':
      contentTypes[extname(filePath)] ?? 'application/octet-stream',
  })
  createReadStream(filePath).pipe(response)
})

server.listen(port, () => {
  console.log(`Static preview: http://localhost:${port}`)
})
