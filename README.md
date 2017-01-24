


# Rings.tv Web App

Built with Vue 2.0 + vue-router + vuex, with server-side rendering.

## Features

- Server Side Rendering
    - Vue + vue-router + vuex working together
    - Server-side data pre-fetching
    - Client-side state & DOM hydration
- Single-file Vue Components
    - Hot-reload in development
    - CSS extraction for production

- Passport authentication locally / 3rd-party OAuth

- Backend Service Support

## File Structure
- build: webpack config for bundle in dev / prod
- client
    - components: vue components
    - plugins: vue mixins / directives / filters
    - router: vue router
    - store: vuex
    - styl: general stylus
    - views
- config: general configs
- public: mock data / static resources (js/css/img, .etc)
- server
    - api: provide api for application
    - middleware: express middlewares
    - model: model mappers (yet)
    - pass: config for passport, can be emitted if unused
    - proxy: for native models, can be emitted if unused

## Build Setup

**Requires Node.js 6+**

```
bash cmds
# install dependencies
npm i
# !!Notice!!
# then refer to this
# https://github.com/ElemeFE/vue-swipe/issues/29

# serve in dev mode, with hot reload on localhost,
# port depends on package.json port
# both frontend and backend
npm run dev
# frontend only
npm run dev-f
# backend only
npm run dev-b

# build for production
npm run build

# serve in production mode
npm start
```

## Deployment

**Requires Nginx and pm2**

```
deploy configuration
# set nginx for nodejs in nginx.conf
upstream nodejs {
    server 127.0.0.1:3000;
    keepalive 64;
}

# touch sites/m.rings.tv
server {
	charset utf-8;
	#client_max_body_size 128M;
  listen       80;
  server_name  m.rings.tv;
  root /usr/local/var/www/m.rings.tv;
  #index index.html index.php;
  access_log /var/log/nginx/m.rings.tv.access.log access;
  error_log /var/log/nginx/m.rings.tv.error.log warn;

  location / {
    proxy_pass http://nodejs;
    proxy_http_version 1.1;
    proxy_set_header    Upgrade         $http_upgrade;
    proxy_set_header    Connection      'upgrade';
    proxy_set_header    Host            $host;
    proxy_cache_bypass  $http_upgrade;
    proxy_redirect off;
    #proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
    #proxy_set_header   X-NginX-Proxy   true;
  }

  location ~ /\.(ht|svn|git|idea|vscode){
  	deny all;
  }
}

# start in prod
pm2 start npm -- start

```