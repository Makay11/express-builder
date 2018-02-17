const path = require("path");

const expressBuilder = require("..");

const app = {
  get: route => console.log("get", route),
  post: route => console.log("post", route),
  put: route => console.log("put", route),
  delete: route => console.log("delete", route),
};

expressBuilder(app, path.resolve(__dirname, "./routes"));
