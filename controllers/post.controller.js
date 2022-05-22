const Post = require("../models/post.model"); // model Post
// const Comment = require("../models/comment.model")
const User = require("../models/user.model")
const { successHandler, errorHandler } =require('../server/handle')
// create and save a new post
exports.create = async (req, res) => {
  try {
    const { userId, content, image, likes ,tags} = req.body;
    let dataPost = {
      user: userId,
      tags,
      type: req.body.type || "person",
      image,
      content,
      likes,
    };
    if (!dataPost.content) {
      errorHandler(res, '內容不能為空');
    } else {
      const newPost = await Post.create(dataPost);
      let payload = { postId: newPost._id };
      successHandler(res, 'success', payload);
    }
  } catch (error) {
    errorHandler(res, error);
  }
};

// retrieve all posts from db
exports.findAll = async(req, res) => {
  try {
    const timeSort = req.query.timeSort === 'asc' ? 'createdAt' : '-createdAt'
    const q = req.query.keyword !== undefined ? { content: new RegExp(req.query.keyword) } : {}
    const allPost = await Post.find(q).populate({path:'user',select: 'name photo'}).sort(timeSort)
   
    if (allPost) {
      successHandler(res,'success',allPost)
    } else {
      errorHandler(res, error)
    }
  } catch (error) {
    errorHandler(res, error)
  }
};

// find a single post by id
exports.findOne = async(req, res) => {
  try {
    const postId = req.params.id
    const postItem = await Post.find({_id:postId})
    if(!Object.keys(postItem).length){
      errorHandler(res,"無此ID")
    }else{
      successHandler(res,'success',postItem)
    }
  } catch (error) {
    errorHandler(res,"無此ID")
  }
};


exports.updateComment = async (req, res) => {
  try {
    const {postId,userId,comment} = req.body
    const data ={postId,userId,comment}
    const userInfo = await User.find({_id:userId})
    // const postDataComments = {userName:'sss234',userPhoto:'sssaas',message:data.comment}
    const postDataComments = {userName:userInfo[0].userName,userPhoto:userInfo[0].avatar,message:comment}
    const postItem= await Post.findOneAndUpdate({_id:postId},{ $push: { comments: postDataComments  } });

    if(!data.comment){
      errorHandler(res,"內容不能為空")
    }else{
      
      res.status(200).send({ status: "success",postItem  });
    }
  } catch (error) {
    errorHandler(res, error);
  }
};

// update a post by id
exports.update = async(req, res) => {
  try {
    const {userName,content,image,likes} = req.body 
    const data ={userName,content,image,likes}
    if(!data.content){
      errorHandler(res,"內容不能為空")
    }else{
      const editPost = await Post.findByIdAndUpdate(req.params.id, data);
      console.log(editPost)
      if(!editPost){
        errorHandler(res,"查無此ID，無法更新")
      }else{
        successHandler(res,'success',editPost)
      }
    }
  } catch (error) {
    errorHandler(res,"查無此ID，無法更新")

  }
};

// delete a post by id
exports.delete = async(req, res) => {
  try {
    const postId = req.params.id
    const deletePost = await Post.findByIdAndDelete(postId)
    if(!deletePost){
      errorHandler(res,'刪除失敗，無此ID')
    }else{
      successHandler(res,"刪除成功")
    }
  } catch (error) {
    errorHandler(res,error)
  }
};

// delete all posts
exports.deleteAll = async(req, res) => {
  await Post.deleteMany({});
  successHandler(res,"全部資料已刪除")
};


