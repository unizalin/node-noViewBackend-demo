const Post = require("../models/post.model"); // model Post
const User = require("../models/user.model")
const { successHandler, errorHandler } =require('../server/handle')
const appError = require("../server/appError")
const handleErrorAsync = require("../server/handleErrorAsync")
// create and save a new post
exports.create = handleErrorAsync(async (req, res,next) => {
    const { userId, content, image, likes ,tags} = req.body;
    let dataPost = {
      user: userId,
      tags,
      type: req.body.type || "person",
      image,
      content,
      likes,
    };
    const user = await User.findById(dataPost.user).exec();
    if(!user){
      return next(appError(400,"查無此ID，無法發文",next))
    }
    if (!dataPost.content) {
      return next(appError(400,"內容不能為空",next))
    }

    const newPost = await Post.create(dataPost);
    let payload = { postId: newPost._id };
    successHandler(res, 'success', payload);
});

// retrieve all posts from db
exports.findAll = handleErrorAsync ( async(req, res , next) => {
    
    const timeSort = req.query.timeSort === 'asc' ? 'createdAt' : '-createdAt'
    const q = req.query.keyword !== undefined ? { content: new RegExp(req.query.keyword) } : {}
    const allPost = await Post.find(q).populate({path:'user',select: 'name photo'}).sort(timeSort)
  
    if (allPost) {
      successHandler(res,'success',allPost)
    } else {
      errorHandler(res, error)
    }
  
});

// find a single post by id
exports.findOne = handleErrorAsync (async(req, res, next) => {

    const postId = req.params.id
    const postItem = await Post.find({_id:postId})
    
    if(!Object.keys(postItem).length){
      return next(appError(400,"無此ID貼文",next))
    }
    successHandler(res,'success',postItem)
  
});


exports.updateComment = handleErrorAsync( async (req, res ,next) => {

  const {postId,userId,comment} = req.body
  const data ={postId,userId,comment}
  const userInfo = await User.find({_id:userId})
  const postDataComments = {userName:userInfo[0].userName,userPhoto:userInfo[0].avatar,message:comment}
  const postItem= await Post.findOneAndUpdate({_id:postId},{ $push: { comments: postDataComments  } });

  if(!data.comment){
    return next(appError(400,"內容不能為空",next))
  }
    successHandler(res,'success',postItem)
});

// update a post by id
exports.update = handleErrorAsync (async(req, res, next) => {

    const {userName,content,image,likes} = req.body 
    const data ={userName,content,image,likes}
    if(!data.content){
      return next(appError(400,"內容不能為空",next))
    }
    
    const editPost = await Post.findByIdAndUpdate(req.params.id, data);
    if(!editPost){
      return next(appError(400,"查無此ID，無法更新",next))
    }
      successHandler(res,'success',editPost)
});

// delete a post by id
exports.delete = handleErrorAsync (async(req, res, next) => {
    const postId = req.params.id
    const deletePost = await Post.findByIdAndDelete(postId)
    if(!deletePost){
      return next(appError(400,"刪除失敗，無此ID",next))
    }
    successHandler(res,"刪除成功")
});

// delete all posts
exports.deleteAll = handleErrorAsync ( async(req, res, next) => {
  await Post.deleteMany({});
  successHandler(res,"全部資料已刪除")
});


