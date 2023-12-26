// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => 1;

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favoriteBlog = (blogs) =>{
  let mostLiked = blogs.reduce((prev, curr) => (prev.likes > curr.likes) ? prev : curr);

  let mostLikedBlog = {
    title: mostLiked.title,
    author: mostLiked.author,
    likes: mostLiked.likes
  };

  return mostLikedBlog;
};

const mostBlogs = (blogs) => {
  const lodash = require("lodash");

  const authorsObj = lodash.countBy(blogs, "author");
  const authorsArr = lodash.map(authorsObj, (b, n) => ({ author: n, blogs: b }));
  const mostBlogs = lodash.maxBy(authorsArr, "blogs");

  return mostBlogs;
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs };
