import { createSlice } from "@reduxjs/toolkit";
import { AxiosHeaders } from "axios";

interface FileItem {
  filename: string;
  text: string;
  data: string;
  sentToUser: string;
  userWillReceive: string;
  sentFromDevice: string;
  id: string;
  status: string;
}


interface AuthState {
    isAuth: boolean,
    token: String | null,
    userData: {
        avatar: {
            "400": String,
            "1000": String
        },
        username: String,
        email: String,
        shareId: String,
        emailNew: String,
        filseStorySend: FileItem[],
        filseStoryGet: FileItem[],
        isGuest: Boolean
    } | null,
}

const authReducer = createSlice({

    name: 'counter',

    initialState: {
        isAuth: false,
        userData: null
    } as AuthState,

    reducers: {
        setAuth: (state) => {
            state.isAuth = true
        },
        setUserData: (state, action) => {
            console.log(action.payload);
            state.userData = action.payload
            state.isAuth = true
        }
    }
})

export const {setAuth, setUserData} = authReducer.actions
export default authReducer.reducer;