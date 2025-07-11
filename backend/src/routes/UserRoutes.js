const express=require("express")
const userController=require("../controllers/AuthController")
const upload = require('../utils/uploadUtil'); 


router=express()
router.delete("/user/:id", userController.deleteUser); 
router.get("/users", userController.getAllUsers); 
router.get("/drivers", userController.getAllDrivers); 
router.post("/login",userController.login)
router.post("/register",userController.register)
router.post("/registerDriver", upload.single("idProof"),userController.registerDriver)
router.post("/refresh",userController.refreshToken)
router.post("/logout",userController.logout)
module.exports=router