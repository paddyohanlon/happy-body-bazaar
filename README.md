# The Happy Body App with REST API

The Happy Body Vue.js app is meant as a companion app for people doing the [Happy Body](https://thehappybody.com/) program. It helps calculate dumbbell weights and record body measurements to track progress.

The app is set up to be used with "RethinkIdentity", an identity and data storage provider using OAuth.

The app is set up to use the OAuth Authorization code flow for SPAs (without a client secret), using PKCE. See `.env.local`

## Vue.js project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
