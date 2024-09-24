const { getPosts, getUsers, getAllComments } = require("../typicode-api");
const { NotFoundError, InternalServerError } = require("../errors");

let cachedData = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000;

exports.fetchPosts = async (start, size) => {
  const now = Date.now();
  if (cachedData && now - cacheTimestamp < CACHE_DURATION) {
    console.log("Serving from cache");
    return paginatePosts(
      cachedData.posts,
      cachedData.users,
      cachedData.comments,
      start,
      size
    );
  }
  try {
    const [postsResponse, usersResponse, commentsResponse] = await Promise.all([
      getPosts(),
      getUsers(),
      getAllComments(),
    ]);

    cachedData = {
      posts: postsResponse.data,
      users: usersResponse.data,
      comments: commentsResponse.data,
    };
    cacheTimestamp = now;

    return paginatePosts(
      cachedData.posts,
      cachedData.users,
      cachedData.comments,
      start,
      size
    );
  } catch (error) {
    console.error(`Error fetching posts: ${error.message}`); // TODO: Send this to a logger API
    if (!error.status) {
      throw new InternalServerError("Failed to fetch posts.");
    }
    throw error;
  }
};

function paginatePosts(posts, users, comments, start, size) {
  const startIndex =
    Number.isInteger(Number(start)) && Number(start) >= 0
      ? parseInt(start, 10)
      : 0;
  const pageSize =
    Number.isInteger(Number(size)) && Number(size) > 0
      ? parseInt(size, 10)
      : posts.length;

  if (startIndex >= posts.length || pageSize <= 0) {
    throw new NotFoundError(
      "No blog posts found for the specified pagination parameters."
    );
  }

  const paginatedPosts = posts.slice(startIndex, startIndex + pageSize);

  const enrichedPosts = paginatedPosts.map((post) => {
    const user = users.find((user) => user.id === post.userId);
    const postComments = comments.filter(
      (comment) => comment.postId === post.id
    );
    return { ...post, user: user || null, comments: postComments || [] };
  });

  return {
    total: posts.length,
    start: startIndex,
    size: enrichedPosts.length,
    data: enrichedPosts,
  };
}
