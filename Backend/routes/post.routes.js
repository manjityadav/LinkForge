import { Router } from "express";
import {
  activeCheck,
  commentPost,
  createPost,
  deleteCommentOfUser,
  deletePost,
  getAllPosts,
  getCommentByPost,
  incrementLikes,
} from "../controllers/post.controller.js";

import multer from "multer";

const router = Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Routes
router.route("/").get(activeCheck);

router.route("/post").post(upload.single("media"), createPost);

router.route("/get_posts").get(getAllPosts);

router.route("/delete_post").delete(deletePost);

router.route("/comment_post").post(commentPost);

router.route("/get_comment_by_post").get(getCommentByPost);

router.route("/delete_comment_of_user").delete(deleteCommentOfUser);

router.route("/increment_likes").post(incrementLikes);

export default router;