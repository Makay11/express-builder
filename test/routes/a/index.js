module.exports = [
  (req, res) => {
    throw new Error("fake error at get /a/");
  },
  (err, req, res, next) => res.send(err.message),
];
