const notFoundMiddleware = (req, res) => {
  res.status(404).json({ msg: "This page does not belong to us." });
};

module.exports = notFoundMiddleware;
