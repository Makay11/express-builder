const path = require("path");

const express = require("express");

const expressBuilder = require("..");

describe("express-builder", () => {
  let app;

  beforeEach(() => {
    app = express().enable("strict routing");
  });

  it("should throw if the path is not absolute", () => {
    expect.assertions(1);

    try {
      expressBuilder(app, "./empty");
    }
    catch (e) {
      expect(e.message).toBe("Root path must be absolute.");
    }
  });

  it("should throw if the path is absolute and there is an invalid module export", () => {
    expect.assertions(1);

    try {
      expressBuilder(app, path.resolve(__dirname, "./invalidModule"));
    }
    catch (e) {
      expect(e.message).toBe("Invalid module export in \"index.js\"");
    }
  });

  it("should succeed if the path is absolute and the directory is empty", () => {
    expressBuilder(app, path.resolve(__dirname, "./empty"));
  });

  it("should succeed if the path is absolute and the directory contains nested directories and files with mixed module exports", () => {
    expressBuilder(app, path.resolve(__dirname, "./routes"));
  });
});
