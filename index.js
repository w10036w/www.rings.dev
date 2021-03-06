process.env.VUE_ENV = 'server'
const isProd = process.env.NODE_ENV === 'production'
const cfg = require('./config')
const port = process.env.PORT || cfg.port

const fs = require('fs')
const path = require('path')
const resolve = file => path.resolve(__dirname, file)
const express = require('express')
const favicon = require('serve-favicon')
const serialize = require('serialize-javascript')

// https://github.com/vuejs/vue/blob/next/packages/vue-server-renderer/README.md#why-use-bundlerenderer
const createBundleRenderer = require('vue-server-renderer').createBundleRenderer

let app = express()

/** load backend services / apis here */
app = require('./server')(app);

// parse index.html template
const html = (() => {
  const template = fs.readFileSync(resolve('./index.html'), 'utf-8')
  const i = template.indexOf('{{ APP }}')
  // styles are injected dynamically via vue-style-loader in development
  const style = isProd ? '<link rel="stylesheet" href="/dist/styles.css">' : ''
  return {
    head: template.slice(0, i).replace('{{ STYLE }}', style),
    tail: template.slice(i + '{{ APP }}'.length)
  }
})()

// setup the server renderer, depending on dev/prod environment
let renderer
if (isProd) {
  // create server renderer from real fs
  const bundlePath = resolve('./dist/server-bundle.js')
  renderer = createRenderer(fs.readFileSync(bundlePath, 'utf-8'))
} else {
  require('./build/setup-dev-server')(app, bundle => {
    renderer = createRenderer(bundle)
  })
}

function createRenderer (bundle) {
  return createBundleRenderer(bundle, {
    cache: require('lru-cache')({
      max: 1000,
      maxAge: 1000 * 60 * 15
    })
  })
}

app.use('/dist', express.static(resolve('./dist')))
app.use(express.static(__dirname+'/public'))
//app.use(favicon(resolve('./src/assets/logo.png')))

app.get('*', (req, res) => {
  if (!renderer) {
    return res.end('waiting for compilation...')
  }
  res.setHeader("Content-Type", "text/html");
  var s = Date.now()
  const context = { url: req.url }
  const renderStream = renderer.renderToStream(context)

  renderStream.once('data', () => {
    res.write(html.head)
  })

  renderStream.on('data', chunk => {
    res.write(chunk)
  })

  renderStream.on('end', () => {
    // embed initial store state
    if (context.initialState) {
      res.write(
        `<script>window.__INITIAL_STATE__=${
          serialize(context.initialState, { isJSON: true })
          }</script>`
      )
    }
    res.end(html.tail)
    console.log(`whole request: ${Date.now() - s}ms`)
  })

  renderStream.on('error', err => {
    if (err && err.code === '404') {
      res.status(404).end('404 | Page Not Found')
      return
    }
    // Render Error Page or Redirect
    res.status(500).end('Internal Error 500')
    console.error(`error during render : ${req.url}`)
    console.error(err)
  })
})

/*const apiPort = port + 1;
api.listen(apiPort, () => {
  console.log(`api started at localhost:${apiPort}`)
})*/
app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})
