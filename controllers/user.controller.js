const { successHandler, errorHandler } = require('../server/handle');
const User = require('../models/user.model');

exports.create = async(req,res)=>{
    try {
        const {name,email,gender,photo} = req.body
        const data = {name,email,gender,photo}
        console.log(data)
        const newUser = await User.create(data)
        successHandler(res,'success',newUser)
    } catch (error) {
        errorHandler(res,error)
    }
}

exports.findAll = async(req,res)=>{
    const allUser = await User.find()
    successHandler(res,'success',allUser)

}

exports.findOne = async(req,res)=>{
    try {
        const userId = req.params.id
        const userItem = await User.find({_id:userId})
        if(!Object.keys(userItem).length){
          errorHandler(res,"無此ID")
        }else{
          successHandler(res,'success',userItem)
        }
      } catch (error) {
        errorHandler(res,"無此ID")
      }
}
