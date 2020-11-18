import path from 'path'
import fs from 'graceful-fs'

const dir = path.join(__dirname, '../static/coins')

const mime = {
  gif: 'image/gif',
  jpg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
}

/*
** Icons API Server Middleware
**
** @param {http.ClientRequest} req Node.js internal client request object
** @param {http.ServerResponse} res Node.js internal response
** @param {Function} next middleware callback (optional)
*/
export default function (req, res) {
  const url = new URL('http://example.com' + req.url)
  const symbol = url.pathname.substr(1).toUpperCase()
  let message = null

  console.log(dir, symbol)
  fs.readdir(dir, (err, entrys) => {
    if (err) {
      console.error(err)
      message = err
    } else {
      for (const entry of entrys) {
        console.log(` * ${entry}`)
        if (entry.startsWith(symbol + '.')) {
          const filepath = path.join(dir, entry)
          const type = mime[path.extname(filepath).slice(1)]
          if (type) {
            message = `/coins/${entry}`
            break
          }
          console.log(`    - ${type} - ${filepath}`)
          // const s = fs.createReadStream(filepath)
          // s.on('open', function () {
          //   res.setHeader('Content-Type', type)
          //   s.pipe(res)
          // })
        }
      }
      if (!message) {
        message = `No image found for ${symbol}`
      }
    }
    res.setHeader('Content-Type', 'text/plain')
    res.end(message)
  })
}
