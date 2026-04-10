import { clientServer } from "@/src/config";
import { asyncThunkCreator, createAsyncThunk } from "@reduxjs/toolkit";


export const loginUser=createAsyncThunk(
    'user/login',
    async(user,thunkAPI)=>{
        console.log(user.email)

        try{

            const response=await clientServer.post("/login",{
                email:user.email,
                password:user.password
            });

            if(response.data.token){
                localStorage.setItem("token", response.data.token)
            }else{
                return thunkAPI.rejectWithValue({message:"token not found"})
            }
            
            return thunkAPI.fulfillWithValue(response.data.token);

        }catch(err){
            return thunkAPI.rejectWithValue({message:err.response.data.message});
        }
    }

)

export const registerUser = createAsyncThunk(
'user/register',
async(user, thunkAPI)=>{
    try{

        const request = await clientServer.post("/register",{
            username:user.username,
            password:user.password,
            email:user.email,
            name:user.name
        })

        return thunkAPI.fulfillWithValue(request.data)

    }catch(err){
        return thunkAPI.rejectWithValue(err.response.data)
    }
})

 export const getAboutUser=createAsyncThunk(
    "user/getAboutUser",
    async(user,thunkAPI)=>{
        try{

            const response=await clientServer.get('/get_user_and_profile',{
                params:{
                    token:user.token
                }
            })
            return thunkAPI.fulfillWithValue(response.data)
            
        }catch(err){
           return  thunkAPI.rejectWithValue(err.response.data)
        }
    }
 )

 export const getAllUSers=createAsyncThunk(
    'user/getAllUsers',
    async(_,thunkAPI)=>{
        try{

            const response=await clientServer.get('get_all_userProfiles')
            return thunkAPI.fulfillWithValue(response.data)

    }catch(err){
        return thunkAPI.rejectWithValue(err.response.data)
    }
    }
 )

 export const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/user/send_connection_request", {
        token: user.token,
        connectionId: user.userId,
      });

      thunkAPI.dispatch(getMyConnectionsRequest({token:user.token}))

      return thunkAPI.fulfillWithValue(response.data)
    } catch (err) {
      return thunkAPI.rejectWithValue({ message: err.message });
    }
  }
);


export const getConnectionRequest = createAsyncThunk(
  "user/getConnectionRequest",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/get_connection_request", {
        params: { token: user.token },
      });

      return thunkAPI.fulfillWithValue(response.data)
    } catch (err) {
      return thunkAPI.rejectWithValue({ message: err.message });
    }
  }
);


export const getMyConnectionsRequest = createAsyncThunk(
  "user/getMyConnectionsRequest",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/user_connection_request", {
        params: { token: user.token },
      });

      return response.data.connections;
    } catch (err) {
      return thunkAPI.rejectWithValue({ message: err.message });
    }
  }
);

export const acceptConnection = createAsyncThunk(
  "user/acceptConnection",
  async (data, thunkAPI) => {
    try {
      const response = await clientServer.post("/user/accept_connection_request", {
        token: data.token,
        connectionId: data.requestId,
        action_type: data.action_type,
      });
      thunkAPI.dispatch(getMyConnectionsRequest({token:user.token}))
      thunkAPI.dispatch(getConnectionRequest({token:user.token}))
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue({ message: err.message });
    }
  }
);