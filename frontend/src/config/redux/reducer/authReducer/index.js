import { createSlice } from "@reduxjs/toolkit";
import {
  getAboutUser,
  getAllUSers,
  getConnectionRequest,
  getMyConnectionsRequest,
  loginUser,
  registerUser,
} from "../../action/authAction";

const initialState = {
  user: undefined,
  isError: false,
  isSucess: false,
  isLoading: false,
  loggedIn: false,
  isTokenThere: false,
  message: "",
  profileFetch: false,
  profilePicture: "",
  connections: [],
  connectionRequest: [],
  all_users: [],
  all_profiles_fetched: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => {
      state.message = "hello";
    },
    emptyMessage: (state) => {
      state.message = "";
    },
    setTokenIsThere: (state) => {
      state.isTokenThere = true;
    },
    setTokenIsNotThere: (state) => {
      state.isTokenThere = false;
    },
    setLoggedIN: (state) => {
      state.loggedIn = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "knocking the door ....";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSucess = true;
        state.loggedIn = true;
        state.message = "loggin is successfull";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Registring you...";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSucess = true;
        state.message = {
          message:"Registration is Sucessful, Please login"
        };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
        state.isLoading = false;
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.profileFetch = true;
        state.user = action.payload;
        state.connections = action.payload?.connections || [];
        state.connectionRequest = action.payload?.connectionRequest || [];
      })
      .addCase(getAllUSers.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.all_profiles_fetched = true;
        state.all_users = action.payload;
      })
      .addCase(getConnectionRequest.fulfilled, (state, action) => {
        state.connectionRequest= action.payload;
      })
      .addCase(getConnectionRequest.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(getMyConnectionsRequest.fulfilled, (state, action) => {
        state.connections = action.payload;
      })
      .addCase(getMyConnectionsRequest.rejected, (state, action) => {
        state.message = action.payload;
      });
  },
});

export default authSlice.reducer;
export const {
  emptyMessage,
  reset,
  setTokenIsNotThere,
  setTokenIsThere,
  setLoggedIN,
} = authSlice.actions;
