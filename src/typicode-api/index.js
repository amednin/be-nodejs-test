const axios = require("axios");
const { TYPICODE_API_URL } = require("../../config/config");

exports.getPosts = async () => {
    return axios.get(`${TYPICODE_API_URL}/posts`);
}

exports.getUsers = async () => {
    return axios.get(`${TYPICODE_API_URL}/users`);
}

exports.getComments = async (postId) => {
    return axios.get(
        `${TYPICODE_API_URL}/posts/${postId}/comments`
      );
}
