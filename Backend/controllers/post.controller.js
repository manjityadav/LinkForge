import User from '../models/user.model.js'
import Post from '../models/post.model.js'
import Comment from '../models/comments.model.js'


export const activeCheck=async(req,res)=>{
    return res.status(200).json({message:"RUNNING"})
}

export const createPost=async(req,res)=>{
    const {token}=req.body;
    try{

        const user=await User.findOne({token});

        if(!user){
            return res.status(500).json({message:"user not found"})
        }

        const post=new Post({
            userId:user._id,
            body:req.body.body,
            media:req.file!=undefined?req.file.filename:"",
            fileType:req.file !=undefined?req.file.mimetype.split('/')[1]:""

        })

        await post.save();

        return res.status(200).json({message:"post created"});

    }catch(err){
        return res.status(404).json({message:err.message})
    }
}

export const getAllPosts=async(req,res)=>{
    try{
        const posts=await Post.find().populate('userId','email username name profilePicture')

        return res.json({posts})
    }catch(err){
        return res.json({message:err.message})
    }
}

export const deletePost = async (req, res) => {
  const { token, post_id } = req.body;

  try {
    const user = await User.findOne({ token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const post = await Post.findOne({ _id: post_id });

    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    if (post.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "user is unauthorized" });
    }

    await Post.deleteOne({ _id: post_id });

    return res.json({ message: "post deleted" });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const commentPost = async (req, res) => {

  const { token, postId, commentBody } = req.body;

  try {

    const user = await User.findOne({ token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    const comment = new Comment({
      userId: user._id,
      postId: postId,
      comment: commentBody
    });

    await comment.save();

    return res.status(200).json({
      message: "comment added",
      comment
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

};

export const getCommentByPost = async (req, res) => {

  const { postId } = req.query;

  try {

    const comments = await Comment.find({ postId })
      .populate("userId", "username profilePicture name");

    return res.status(200).json({ comments });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const deleteCommentOfUser=async(req,res)=>{
    const {token,commentId}=req.body;

    try{

        const user=await User.findOne({token}).select("_id")

        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        
        const comment=await Comment.findOne({_id:commentId})

        if(!comment){
            return res.status(404).json({message:"comment not found"})
        }

        if(comment.userId.toString()!==user._id.toString()){
            return res.status(401).json({comment:"user is unAuthorized"})
        }

        await Comment.deleteOne({_id:comment._id});

        return res.josn({message:"comment deleted"});

    }catch(err){
        return res.status(404).json({comment:err.comment})
    }
}

export const incrementLikes=async(req,res)=>{

    const {postId}=req.body;

    try{

        const post=await Post.findOne({_id:postId})

        if(!post){
            return res.status(404).json({message:"post not found"})
        }

        post.likes=post.likes+1;

        await post.save();

        return res.status(200).json({message:"likes incremented"});

    }catch(err){
        return res.status(500).json({message:err.message})
    }
}