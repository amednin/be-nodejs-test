module.exports = (err, _req, res, _next) => {
  console.error(err.message); // TODO: Send this to a logger API

  if (err.status === 404) {
    return res.status(404).json({ error: "Not found", message: err.message });
  }

  res
    .status(500)
    .json({ error: "Internal Server Error", message: err.message });
};
