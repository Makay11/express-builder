const path = require("path");

const express = require("express");
const supertest = require("supertest");

const expressBuilder = require("..");

const app = express().enable("strict routing");
const request = supertest(app);

expressBuilder(app, path.resolve(__dirname, "./routes"));

describe("mounted routes", () => {
  it("should have index.js => get /", () => {
    expect.assertions(1);

    return request.get("/").expect(200).then(response => {
      expect(response.text).toBe("get /");
    });
  });

  it("should have a.js => get /a, post /a", () => {
    expect.assertions(2);

    return Promise.all([
      request.get("/a").expect(200).then(response => {
        expect(response.text).toBe("get /a");
      }),
      request.post("/a").expect(200).then(response => {
        expect(response.text).toBe("post /a");
      }),
    ]);
  });

  it("should have /a/index.js => get /a/", () => {
    expect.assertions(1);

    return request.get("/a/").expect(200).then(response => {
      expect(response.text).toBe("fake error at get /a/");
    });
  });

  it("should have /a/b.js => get /a/b", () => {
    expect.assertions(2);

    return Promise.all([
      request.get("/a/b").expect(200).then(response => {
        expect(response.text).toBe("get /a/b");
      }),
      request.post("/a/b").expect(200).then(response => {
        expect(response.text).toBe("fake error at post /a/b");
      }),
    ]);
  });

  it("should have /a/b/_c.js => get /a/b/:c", () => {
    expect.assertions(1);

    return request.get("/a/b/test").expect(200).then(response => {
      expect(response.text).toBe("get /a/b/test");
    });
  });

  it("should have /a/b/_c/index.js => get /a/b/:c/", () => {
    expect.assertions(1);

    return request.get("/a/b/test/").expect(200).then(response => {
      expect(response.text).toBe("get /a/b/test/");
    });
  });

  it("should have /a/b/_c/d.js => get /a/b/:c/d", () => {
    expect.assertions(1);

    return request.get("/a/b/test/d").expect(200).then(response => {
      expect(response.text).toBe("get /a/b/test/d");
    });
  });

  it("should have /a/b/_c/_e.js => get /a/b/:c/:e", () => {
    expect.assertions(1);

    return request.get("/a/b/test1/test2").expect(200).then(response => {
      expect(response.text).toBe("get /a/b/test1/test2");
    });
  });
});
