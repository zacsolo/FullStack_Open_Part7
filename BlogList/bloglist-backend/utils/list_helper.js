// //--Exercises For Assignments 4.3-4.5 ------------

// const dummy = (blogs) => {
//   return 1;
// };

// const totalLikes = (blogs) => {
//   const likesArr = blogs.map((blog) => blog.likes);
//   const total = likesArr.reduce((acc, curVal) => acc + curVal);
//   return total;
// };

// const favoriteBlog = (blogs) => {
//   let highestLiked = 0;
//   blogs.map((blog) =>
//     blog.likes > highestLiked ? (highestLiked = blog.likes) : null
//   );
//   const singleBlog = blogs.find((blog) => blog.likes === highestLiked);
//   return {
//     title: singleBlog.title,
//     author: singleBlog.author,
//     likes: singleBlog.likes,
//   };
// };
// //------------------------------------------------------

// module.exports = {
//   dummy,
//   totalLikes,
//   favoriteBlog,
//   mostBlogs,
//   mostLikes,
// };

// //--Exercises For Assignments 4.3-4.7 ------------
