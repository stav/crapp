import Vue from 'vue'
import bodyParser from 'body-parser'

// Vue.use((x) => {
//   console.log('in', x)
// })

// Vue.use('/api', bodyParser.json())
// Vue.use(bodyParser.json())
// Vue.use(bodyParser.urlencoded({ extended: true }))

// Vue.use(function(req, _res, next) {
//   console.log('fenn', typeof req, req)
//   let data = ''
//   req.on('data', function(chunk) {
//     data += chunk
//   })
//   req.on('end', function() {
//     req.rawBody = data
//     console.log('on end: ', data)
//     if (data?.includes('{')) {
//       req.body = JSON.parse(data)
//     }
//     next()
//   })
// })

// export default ({ app }, inject) => {
// }

export function install (Vue1, options = {}) {
  console.log('qwer', Vue1.use, options)
  // Vue1.use(bodyParser.json())
}

const plugin = {
  install,
}

export default plugin

Vue.use(plugin)
