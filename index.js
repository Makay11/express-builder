const fs = require("fs");
const path = require("path");

module.exports = (app, rootPath) => {
  if (path.isAbsolute(rootPath)) {
    build(rootPath);
  }
  else {
    throw new Error("Root path must be absolute.");
  }

  function build(dirPath) {
    fs.readdirSync(dirPath).forEach(file => {
      const filePath = path.join(dirPath, file);

      const stats = fs.statSync(filePath);

      if (stats.isFile()) {
        const module = require(filePath); // eslint-disable-line global-require, import/no-dynamic-require

        const route = `/${path.relative(rootPath, filePath).replace(/\..*?$/, "").replace(/\\/g, "/").replace(/\/_/g, "/:")}`.replace(/\/index$/, "/");

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
      else if (stats.isDirectory()) {
        build(filePath);
      }
    });
  }

  function wrapAsync(middleware) {
    if (Array.isArray(middleware)) {
      return middleware.map(f => wrapAsync(f));
    }

    return (req, res, next) => {
      const p = middleware(req, res, next);

      if (p.catch) p.catch(next);
    };
  }
};
