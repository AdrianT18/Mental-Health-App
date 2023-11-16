import axios from "axios";
import authHeader from "./auth.header";

// A function that returns a promise that will get the forum posts
const getForumPost = () => {
    return axios.get("http://localhost:3001/api/forumPost/getUser/", { headers: authHeader() });
};

const postService = {
    getForumPost,
};

export default postService;