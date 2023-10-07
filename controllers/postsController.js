const Post = require("../model/Post");
const User = require("../model/User");
const mongoose = require("mongoose");

const getAllPosts = async (req, res) => {
  const posts = await Post.find().exec();
  if (!posts) return res.status(204).json({ message: "No Posts found" });
  res.json(posts);
};

const handleNewPost = async (req, res) => {
  const { postTitle, postContent, contentType, userId } = req.body;
  const files = req.files;

  const filename = files?.map((file) => {
    return file.filename;
  });

  const datas = files?.map((file) => {
    return fs.readFileSync("postImg/" + file.filename);
  });

  const postImg = datas?.map((value, index) => ({
    data: value,
    contentType: contentType[index],
    filename: filename[index],
  }));

  const user = await User.findOne({ _id: userId }).exec();

  if (!userId) return res.status(400).json({ message: "No User Found" });
  else if (!user)
    return res.status(400).json({ message: "User is Not Availiable" });
  else if (!postTitle || !postContent)
    return res.status(400).json({ message: "All fields are required" });
  else
    try {
      await Post.create({
        postTitle,
        postContent,
        author: userId,
        postImg,
      });

      res.status(201).json({
        success: `New Post has been created`,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

module.exports = { handleNewPost, getAllPosts };
