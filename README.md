# The Happy Body App with REST API

The Happy Body app is meant as a companion app for people doing the [Happy Body](https://thehappybody.com/) program. It helps calculate dumbbell weights and record body measurements to track progress.

This version of the app is built with a REST API, Express.js backend and RethinkDB database.

It's set up to be deployed to Heroku.

## Running locally

To run locally run migrations if necessary:

```
node migrate.js
```

Then run the following in three separate terminal tabs:

```
rethinkdb --http-port 5000
```

```
NODE_ENV=development node server.js
```

```
npm run serve
```

Set an invalid token in the browser console for testing authentication:

```js
localStorage.setItem(
  "token",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
);
```

## RethinkDB

Backup:

```
rethinkdb dump -f backup.tar.gz
```

Run in development:

```
rethinkdb --http-port 5000
```

Set port other than `8080` because I usually have something already running on 8080.

## Express server backend API

Run in development:

```
NODE_ENV=development node server.js
```

## Heroku notes

Requires the RethinkDB Cloud Add-on:

```
heroku addons:create rethinkdb
```

`Procfile` does migrations. Build and server start steps are in `package.json`.

Deploy:

```
git push heroku master
```

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
