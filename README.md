# The Happy Body App Vue.js SPA

The Happy Body Vue.js app is meant as a companion app for people doing the [Happy Body](https://thehappybody.com/) program. It helps calculate dumbbell weights and record body measurements to track progress.

The app is set up to be used with "RethinkIdentity", an identity and data storage provider using OAuth.

The app is set up to use the OAuth Authorization code flow for SPAs (without a client secret), using PKCE.

## Setup with RethinkIdentity

Check out and run [rethink-identity](https://github.com/mostlytyped/rethink-identity). Follow the setup steps in that repo's README. This Happy Body app is configured (see `.env.local`) to work with rethink-identity. You should be able to sign up, sign in and save user data.

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
