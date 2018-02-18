const path = require("path");

const express = require("express");

const expressBuilder = require("..");

describe("express-builder", () => {
  let app;

  beforeEach(() => {
    app = express().enable("strict routing");
  });

  it("should throw if the path is not absolute", () => {
    expect(() => {
      expressBuilder(app, "./empty");
    }).toThrowError("Root path must be absolute.");
  });

  it("should throw if the path is not absolute", () => {
    expect(() => {
      expressBuilder(app, path.resolve(__dirname, "./invalidModule"));
    }).toThrowError("Invalid module export in \"index.js\"");
  });

  it("should succeed if the path is absolute and the directory is empty", () => {
    expressBuilder(app, path.resolve(__dirname, "./empty"));
  });

  it("should succeed if the path is absolute and the directory contains nested directories and files with mixed module formats", () => {
    expressBuilder(app, path.resolve(__dirname, "./routes"));
  });
});
