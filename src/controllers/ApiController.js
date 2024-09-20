const apiService = require("../services");

exports.getPosts = async (req, res, next) => {
  try {
    const { start = 0, size = 10 } = req.query;
    const data = await apiService.fetchPosts(start, size);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
