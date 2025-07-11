const Models=require("../models/Models")
const {  verifyAccessToken, verifyRefreshToken, generateAccessToken } = require("../utils/jwtutils")

const getUser=async (username)=>{
    const user=await Models.User.findOne({username})
    if(user===null){
      return {isSuccess:false,message:"user does not exist",data:{}}
    }
    return {isSuccess:true,message:"user sucessfully",data:{user}}
}
const deleteUser = async (userId) => {
    try {
        const deletedUser = await Models.User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return { isSuccess: false, message: "User not found" };
        }
        return { isSuccess: true, message: "User deleted successfully" };
    } catch (error) {
        return { isSuccess: false, message: error.message };
    }
};


const getAllUsers = async () => {
    try {
        const users = await Models.User.find({ role: "user" });
        return { isSuccess: true, data: users };
    } catch (error) {
        return { isSuccess: false, message: error.message };
    }
};

const getAllDrivers = async () => {
    try {
        const drivers = await Models.User.find({ role: "driver" });
        console.log("drivers are",drivers);
        
        return { isSuccess: true, data: drivers };
    } catch (error) {
        return { isSuccess: false, message: error.message };
    }
};


const addUser=async(username,password,name,phone,role="user")=>{
    const user =await Models.User.create({username,password,phone,name,role})
    return {isSuccess:true,message:"registered successfully",user}
}
const addDriver=async(_id,idProof)=>{
    const driver=await Models.Driver.create({userId:_id,idProof})
    console.log("driver created with id",_id,"and idproof",idProof);
    
    return {isSuccess:true,message:"registered successfully",driver}
}


const refresh=async (refreshToken)=>{
    const verifiedTokenObj=verifyRefreshToken(refreshToken)
    if(verifiedTokenObj==null){
        return {isSuccess:false,message:"invalid token",data:{}}
    }
    user={username:verifiedTokenObj.username,id:verifiedTokenObj.id}
     const newAccessToken=generateAccessToken(user)
    
    return {isSuccess:true,message:"Token verified and refreshed",token:newAccessToken}
}


module.exports={getUser,addUser,refresh,addDriver,getAllDrivers,getAllUsers,deleteUser}