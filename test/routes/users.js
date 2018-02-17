module.exports = {
  get: (req, res) => res.send("get /users"),
  post: [(req, res) => res.send("post /users")],
};
