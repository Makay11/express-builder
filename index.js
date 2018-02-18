const fs = require("fs");
const path = require("path");

const mm = require("micromatch");

module.exports = (app, rootPath, options = {}) => {
  if (!path.isAbsolute(rootPath)) {
    throw new Error("Root path must be absolute.");
  }

  const shouldInclude = mm.matcher(options.include || "**/*.js");
  const shouldIgnore = mm.matcher(options.ignore || ["**/__tests__/**/*.js", "**/?(*.)(spec|test).js"]);

  const prefix = options.prefix || "";
  const logger = options.logger !== undefined ? options.logger : console.log; // eslint-disable-line no-console

  build(rootPath);

  function build(dirPath) {
    fs.readdirSync(dirPath).forEach(file => {
      const filePath = path.join(dirPath, file);

      const stats = fs.statSync(filePath);

      if (stats.isFile()) {
        const relativePath = path.relative(rootPath, filePath).replace(/\\/g, "/");

        if (shouldInclude(relativePath) && !shouldIgnore(relativePath)) {
          const module = require(filePath); // eslint-disable-line global-require, import/no-dynamic-require

          const route = prefix + `/${relativePath.replace(/\..*?$/, "").replace(/\/_/g, "/:")}`.replace(/\/index$/, "/");

          if (logger) logger(`${relativePath} => ${route}`);

          if (Array.isArray(module) || typeof module === "function") {
            app.get(route, wrapAsync(module));
            if (logger) logger(`get ${route}`);
          }
          else if (typeof module === "object") {
            Object.keys(module).forEach(method => {
              app[method](route, wrapAsync(module[method]));
              if (logger) logger(`${method} ${route}`);
            });
          }
          else {
            throw new Error(`Invalid module export in "${relativePath}"`);
          }
        }
      }
      else if (stats.isDirectory()) {
        build(filePath);
      }
    });
  }

  function wrapAsync(middleware) {
    if (Array.isArray(middleware)) {
      return middleware.map(f => wrapAsync(f));
    }

    if (middleware.length === 4) {
      return (err, req, res, next) => {
        const p = middleware(err, req, res, next);

        if (p && p.catch) p.catch(next);
      };
    }

    return (req, res, next) => {
      const p = middleware(req, res, next);

      if (p && p.catch) p.catch(next);
    };
  }
};
