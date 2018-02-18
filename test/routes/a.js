module.exports = {
  get: (req, res) => res.send("get /a"),
  post: [
    (req, res, next) => next(),
    (req, res) => res.send("post /a"),
  ],
};
