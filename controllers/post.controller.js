const Post = require("../models/post.model"); // model Post
// const Comment = require("../models/comment.model")
const User = require("../models/user.model")
const { successHandler, errorHandler } =require('../server/handle')
// create and save a new post
exports.create = async (req, res) => {
  try {
    const { userId,user, content, image, likes } = req.body;
    const data = { userId, user,content, image, likes };
    console.log(data)
    if (!user || !content) {
      errorHandler(res, '使用者與內容必填');
    } else {
      const findUser = await User.findById(userId).exec();
      console.log('ss',!findUser)
        if (!findUser) {
            errorHandler(res, '查無使用者');
        } else {
          console.log('jet')
            const newPost = await Post.create(data);
            successHandler(res, "新增成功", newPost);
        }
    }
  } catch (error) {
    errorHandler(res,error)
  }
};

// retrieve all posts from db
exports.findAll = async(req, res) => {
  const { keyword, sort } = req.query;
  const dateSort = sort === 'desc' ? -1 : 1;
  const posts = await Post.find({
      content: { $regex: keyword || '' }
  })
      .populate({ 
          path: 'user', // post 內 user 欄位
          select: 'name photo' // 取出相關聯 collection name & photo
      })
      .sort({ 'createdAt': dateSort });
  successHandler(res, "取得成功", posts);
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

// search posts by keyword
exports.search = async (req, res) => {
  try {
    let { keyword, sortby, limit = 10, page = 1 } = req.body;
    let filter = keyword ? { content: new RegExp(`${keyword}`) } : {};
    let sort = sortby === "datetime_pub" ? { createAt: 1 } : {};
    if (page < 0) {
      page = 1;
    }
    let skip = limit * (page - 1);

    const count = await Post.find(filter).count();
    const posts = await Post.find(filter).sort(sort).skip(skip).limit(limit);
    // console.log(posts);
    let resPosts = posts.map((item) => {
      return {
        postId: item._id,
        userName: item.userName,
        userPhoto: item.userPhoto,
        content: item.content,
        image: item.image,
        datetime_pub: item.createAt,
      };
    });
    let payload = { count, limit, page, posts: resPosts };
    res.status(200).send({ status: "success", payload });
  } catch (error) {
    errorHandler(res,"error")
  }
};

exports.updateComment = async(req,res)=>{
  try {
    const {postId,userId,comment} = req.body
    const data ={postId,userId,comment}
    // 差 userModel 取得 留言者 userName userPhoto
    const postDataComments = {userName:'sss234',userPhoto:'sssaas',message:data.comment}
  
    const postItem= await Post.findOneAndUpdate({_id:postId},{ $push: { comments: postDataComments  } });
    console.log(postItem)

    if(!data.comment){
      errorHandler(res,"內容不能為空")
    }else{
      
      res.status(200).send({ status: "success",postItem });
    }
  } catch (error) {
    errorHandler(res,error)
  }
}

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



// find all published posts
exports.findAllPublished = (req, res) => {};
