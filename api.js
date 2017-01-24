const cfg = require('./config')
const port = process.env.PORT || cfg.port
const api = require('./server')()

api.listen(port, () => {
  console.log(`server api started at localhost:${port}`)
});