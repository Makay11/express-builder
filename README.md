# express-builder

[![npm](https://img.shields.io/npm/v/express-builder.svg?style=flat-square)](https://www.npmjs.com/package/express-builder)
[![license](https://img.shields.io/github/license/Makay11/express-builder.svg?style=flat-square)](http://opensource.org/licenses/ISC)
[![Travis branch](https://img.shields.io/travis/Makay11/express-builder/master.svg?style=flat-square)](https://travis-ci.org/Makay11/express-builder)
[![Codecov branch](https://img.shields.io/codecov/c/github/Makay11/express-builder/master.svg?style=flat-square)](https://codecov.io/gh/Makay11/express-builder)
[![Greenkeeper badge](https://badges.greenkeeper.io/Makay11/express-builder.svg)](https://greenkeeper.io/)

[![NPM](https://nodei.co/npm/express-builder.png)](https://nodei.co/npm/express-builder/)

Build express routes automatically and recursively from the file system, with async function middleware support built-in.

## Why?
- [Convention over configuration](https://en.wikipedia.org/wiki/Convention_over_configuration)
- Avoid writing repetitive route definitions.
- Spend less time making decisions before you get started.
- Spend less time writing boilerplate code and more time writing your application code.
- Forces code splitting in a logical way.
- Reduces the number of merge conflicts.
- Maintain complete flexibility and full control over your routes.
- Allows you to transparently use async functions as middleware out-of-the-box to improve readability and speed up development, without ever touching express's internals.

## Installation

```shell
npm install express-builder
```

or

```shell
yarn add express-builder
```

## Usage

```js
const path = require("path");
const express = require("express");
const expressBuilder = require("express-builder");

const app = express();

expressBuilder(app, path.join(__dirname, "routes"));

app.listen(3000, () => console.log("Example app listening on port 3000!"));
```

## API

```js
expressBuilder(app, path, options);
```

- **app** - express application (required)
- **path** (string) - **ABSOLUTE** path of the directory to be recursively read (required)
- **options** (object) - options object (optional)

### options

- **include** (string|string[]) - [micromatch](https://github.com/micromatch/micromatch) pattern(s) of files to include. Defaults to **"\*\*/\*.js"**.
- **ignore** (string|string[]) - [micromatch](https://github.com/micromatch/micromatch) pattern(s) of files to ignore. Defaults to **["\*\*/\_\_tests\_\_/\*\*/\*.js", "\*\*/?(\*.)(spec|test).js"]**.
- **prefix** (string) - Prefix for the created routes, such as **"/api"**. Defaults to **"" (empty string)**.
- **logger** (function) - A function to call for each route created. Useful for debugging. Defaults to **console.log**, use **null** to disable the logger.

## Examples

```js
// routes/index.js

module.exports = (req, res) => res.send("get /");

// Logs:
//   index.js => /
//   get /
```

```js
// routes/users.js

const auth = require("../utils/auth");

module.exports = {
  get: (req, res) => res.send("get /users"),
  post: [
    auth.checkIfUserIsLoggedIn,
    (req, res) => res.send("post /users"),
  ],
};

// Logs:
//   users.js => /users
//   get /users
//   post /users
```

```js
// routes/users/_userId.js

module.exports = {
  get: (req, res) => res.send(`get /users/${req.params.userId}`),
  put: (req, res) => res.send(`put /users/${req.params.userId}`),
  delete: (req, res) => res.send(`delete /users/${req.params.userId}`),
};

// Logs:
//   users/_userId.js => /users/:userId
//   get /users/:userId
//   put /users/:userId
//   delete /users/:userId
```

```js
// routes/users/_userId/projects.js

module.exports = {
  get: async (req, res) => res.send(await Promise.resolve(`get /users/${req.params.userId}/projects`)),
  post: [
    async (req, res) => throw new Error(`post /users/${req.params.userId}/projects`),
    async (err, req, res, next) => res.send(await Promise.resolve(err.message)),
  ]
};

// Logs:
//   users/_userId/projects.js => /users/:userId/projects
//   get /users/:userId/projects
//   post /users/:userId/projects
```

```js
// routes/users/_userId/projects/_projectId.js

module.exports = {
  get: (req, res) => res.send(`get /users/${req.params.userId}/projects/${req.params.projectId}`),
  put: (req, res) => res.send(`put /users/${req.params.userId}/projects/${req.params.projectId}`),
  delete: (req, res) => res.send(`delete /users/${req.params.userId}/projects/${req.params.projectId}`),
};

// Logs:
//   users/_userId/projects/_projectId.js => /users/:userId/projects/:projectId
//   get /users/:userId/projects/:projectId
//   put /users/:userId/projects/:projectId
//   delete /users/:userId/projects/:projectId
```

# Contribute!

Found an issue or want to add a new feature? Feel free to open an issue or make a pull request!
