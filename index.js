const fs = require("fs");
const path = require("path");

const mm = require("micromatch");

module.exports = (app, rootPath, options = {}) => {
  if (!path.isAbsolute(rootPath)) {
    throw new Error("Root path must be absolute.");
  }

  const shouldInclude = mm.matcher(options.include || "**/*.js");
  const shouldIgnore = mm.matcher(options.ignore || ["**/__tests__/**/*.js", "**/?(*.)(spec|test).js"]);

  build(rootPath);

  function build(dirPath) {
    fs.readdirSync(dirPath).forEach(file => {
      const filePath = path.join(dirPath, file);

      const stats = fs.statSync(filePath);

      if (stats.isFile()) {
        const relativePath = path.relative(rootPath, filePath).replace(/\\/g, "/");

        if (shouldInclude(relativePath) && !shouldIgnore(relativePath)) {
          const module = require(filePath); // eslint-disable-line global-require, import/no-dynamic-require

          const route = `/${relativePath.replace(/\..*?$/, "").replace(/\/_/g, "/:")}`.replace(/\/index$/, "/");

          if (Array.isArray(module) || typeof module === "function") {
            app.get(route, wrapAsync(module));
          }
          else if (typeof module === "object") {
            Object.keys(module).forEach(method => {
              app[method](route, wrapAsync(module[method]));
            });
          }
          else {
            throw new Error(`Invalid module export in ${filePath}`);
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

        if (p.catch) p.catch(next);
      };
    }

    return (req, res, next) => {
      const p = middleware(req, res, next);

      if (p.catch) p.catch(next);
    };
  }
};
