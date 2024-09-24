const axios = require("axios");
const { getPosts, getUsers, getComments } = require("../typicode-api");

jest.mock("axios");

describe("Typicode API", () => {
  it("should return paginated posts with users and comments", async () => {
    const mockPosts = [{ id: 1, userId: 1, title: "Post 1" }];
    const mockUsers = [{ id: 1, name: "User 1" }];
    const mockComments = [{ postId: 1, body: "Comment 1" }];

    axios.get.mockResolvedValueOnce({ data: mockPosts });
    axios.get.mockResolvedValueOnce({ data: mockUsers });
    axios.get.mockResolvedValueOnce({ data: mockComments });

    const posts = await getPosts();
    const users = await getUsers();
    const comments = await getComments(1);

    const result = posts.data.map((post) => ({
      ...post,
      user: users.data.find((user) => user.id === post.userId),
      comments: comments.data,
    }));

    expect(result).toEqual([
      {
        id: 1,
        userId: 1,
        title: "Post 1",
        user: { id: 1, name: "User 1" },
        comments: [{ postId: 1, body: "Comment 1" }],
      },
    ]);
  });
});
