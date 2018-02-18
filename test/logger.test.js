const path = require("path");

const express = require("express");

const expressBuilder = require("..");

describe("logger", () => {
  let app;
  const logger = jest.fn();

  beforeEach(() => {
    app = express().enable("strict routing");
    logger.mockClear();
  });

  it("should not be called if the path is not absolute", () => {
    expect.assertions(2);

    try {
      expressBuilder(app, "./empty", { logger });
    }
    catch (e) {
      expect(e.message).toBe("Root path must be absolute.");
    }

    expect(logger).not.toHaveBeenCalled();
  });

  it("should be called if the path is absolute and there is an invalid module export", () => {
    expect.assertions(2);

    try {
      expressBuilder(app, path.resolve(__dirname, "./invalidModule"), { logger });
    }
    catch (e) {
      expect(e.message).toBe("Invalid module export in \"index.js\"");
    }

    expect(logger).toBeCalledWith("index.js => /");
  });

  it("should not be called if the path is absolute and the directory is empty", () => {
    expressBuilder(app, path.resolve(__dirname, "./empty"), { logger });
    expect(logger).not.toHaveBeenCalled();
  });

  it("should be called if the path is absolute and the directory contains nested directories and files with mixed module exports", () => {
    expect.assertions(20);

    expressBuilder(app, path.resolve(__dirname, "./routes"), { logger });

    expect(logger).toHaveBeenCalledTimes(18);

    const logs = logger.mock.calls.map(call => {
      expect(call).toHaveLength(1);
      return call[0];
    }).sort();

    expect(logs).toEqual([
      "a.js => /a",
      "a/b.js => /a/b",
      "a/b/_c.js => /a/b/:c",
      "a/b/_c/_e.js => /a/b/:c/:e",
      "a/b/_c/d.js => /a/b/:c/d",
      "a/b/_c/index.js => /a/b/:c/",
      "a/index.js => /a/",
      "get /",
      "get /a",
      "get /a/",
      "get /a/b",
      "get /a/b/:c",
      "get /a/b/:c/",
      "get /a/b/:c/:e",
      "get /a/b/:c/d",
      "index.js => /",
      "post /a",
      "post /a/b",
    ]);
  });
});
