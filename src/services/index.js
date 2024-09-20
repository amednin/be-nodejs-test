const { getPosts, getUsers, getComments } = require("../typicode-api");

exports.fetchPosts = async (start, size) => {
  try {
    const [postsResponse, usersResponse] = await Promise.all([
      getPosts(),
      getUsers(),
    ]);

    const posts = postsResponse.data;
    const users = usersResponse.data;

    const startIndex =
      Number.isInteger(Number(start)) && Number(start) >= 0
        ? parseInt(start, 10)
        : 0;
    const pageSize =
      Number.isInteger(Number(size)) && Number(size) > 0
        ? parseInt(size, 10)
        : posts.length;

    if (startIndex >= posts.length || pageSize <= 0) {
      const error = new Error(
        "No blog posts found for the specified pagination parameters."
      );
      error.status = 404;
      throw error;
    }

    const paginatedPosts = posts.slice(startIndex, startIndex + pageSize);

    const enrichedPosts = paginatedPosts.map((post) => {
      const user = users.find((user) => user.id === post.userId);
      return { ...post, user: user || null };
    });

    const postsWithUsersAndComments = await Promise.all(
      enrichedPosts.map(async (post) => {
        try {
          const commentsResponse = await getComments(post.id);
          return { ...post, comments: commentsResponse.data || [] };
        } catch (error) {
          return { ...post, comments: [] };
        }
      })
    );

    return {
      total: posts.length,
      start: startIndex,
      size: postsWithUsersAndComments.length,
      data: postsWithUsersAndComments,
    };
  } catch (error) {
    console.error(`Error fetching posts: ${error.message}`); // TODO: Send this to a logger API
    if (!error.status) {
      error.status = 500;
    }
    throw error;
  }
};
