module.exports = {
  get: (req, res) => res.send(`get /users/${req.params.user}`),
  put: (req, res) => res.send(`put /users/${req.params.user}`),
  delete: (req, res) => res.send(`delete /users/${req.params.user}`),
};
