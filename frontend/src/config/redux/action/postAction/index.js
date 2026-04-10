import { clientServer } from "@/src/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllPosts = createAsyncThunk(
  "post/get_posts",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/get_posts");
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async (userData, thunkAPI) => {
    const { file, body } = userData;

    try {
      const formdata = new FormData();

      formdata.append("token", localStorage.getItem("token"));
      formdata.append("body", body);
      formdata.append("media", file);

      const response = await clientServer.post("/post", formdata);

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Upload failed");
    }
  },
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (postId, thunkAPI) => {
    try {
      const response = await clientServer.delete("/delete_post", {
        data: {
          token: localStorage.getItem("token"),
          post_id: postId.postId,
        },
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue("something went wrong");
    }
  },
);

export const incrementLikes = createAsyncThunk(
  "post/increamentLikes",
  async (postId, thunkAPI) => {
    try {
      const response = await clientServer.post("/increment_likes", {
        postId: postId,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue("something went wrong");
    }
  },
);

export const getAllComments = createAsyncThunk(
  "/getAllComments",
  async (postData, thunkAPI) => {
    try {

      const response = await clientServer.get("/get_comment_by_post",{
        params:{
          postId: postData.postId
        }
      });

      return thunkAPI.fulfillWithValue({
        comments: response.data.comments,
        postId: postData.postId
      });

    } catch (err) {
      return thunkAPI.rejectWithValue("something went wrong");
    }
  }
);
export const postComment=createAsyncThunk(
  "/postComment",
  
  async(commentsData,thunkAPI)=>{
    try{
      console.log({
        postId:commentsData.postId,
        comment:commentsData.body
      })
    const response=await clientServer.post("/comment_post",{
      token:localStorage.getItem("token"),
      postId:commentsData.postId,
      commentBody:commentsData.body
    })
    return thunkAPI.fulfillWithValue(response.data)
  }catch(err){
    return thunkAPI.rejectWithValue("someting went wrong")
  }
  }
)