import { Router } from "express";
import {
 acceptConnection,
 addEducation,
 addExperience,
 downloadProfile,
 getAllUserProfile,
 getMyConnections,
 getUserAndProfile,
 getUserProfileAndUserBasedOnUserName,
 login,
 register,
 sendConnectionRequest,
 updateProfileData,
 updateUserProfile,
 uploadProfilePicture,
 whatAreMyconnections
} from "../controllers/user.controller.js";

import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
 destination:(req,file,cb)=>{
   cb(null,'uploads/')
 },
 filename:(req,file,cb)=>{
   const uniqueName = Date.now()+"-"+file.originalname
   cb(null,uniqueName)
 }
})

const upload = multer({storage})

// router.post('/update_profile_picture',upload.single('profile_picture'),uploadProfilePicture)
router.post('/update_profile_picture', upload.single('profilePicture'), uploadProfilePicture);

router.post('/register',register)
router.post('/login',login)
router.post('/user_update',updateUserProfile)

router.get('/get_user_and_profile',getUserAndProfile)
router.post('/update_profile_data',updateProfileData)
router.get('/get_all_userProfiles',getAllUserProfile)
router.get('/download_resume',downloadProfile)
router.post("/add_education", addEducation);
router.post("/add_experience", addExperience);

router.post('/user/send_connection_request',sendConnectionRequest)
router.get('/user/get_connection_request',whatAreMyconnections)
router.get('/user/user_connection_request',getMyConnections)
router.post('/user/accept_connection_request',acceptConnection)
router.get('/user/get_user_based_on_username',getUserProfileAndUserBasedOnUserName)

export default router
