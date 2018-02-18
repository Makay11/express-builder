module.exports = {
  get: async (req, res) => res.send(await Promise.resolve("get /a/b")),
  post: [
    async (req, res) => {
      throw new Error(await Promise.resolve("fake error at post /a/b"));
    },
    async (err, req, res, next) => {
      throw err;
    },
    async (err, req, res, next) => res.send(await Promise.resolve(err.message)),
  ],
};
