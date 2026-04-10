import UserLayout from "@/src/layout/userLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { useRouter } from "next/router";
import { loginUser, registerUser } from "@/src/config/redux/action/authAction";
import { emptyMessage } from "@/src/config/redux/reducer/authReducer";

const LoginComponent = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const authState = useSelector((state) => state.auth);

  const [isLogginMethod,setislogginMethod]=useState(false)

  const [username,setusername]=useState('')
  const [name,setname]=useState('')
  const [password,setpassword]=useState('')
  const [email,setemail]=useState('')

  useEffect(()=>{
    if(authState.loggedIn){
      router.push('/dashboard')
    }
  },[authState.loggedIn])

  useEffect(()=>{
    dispatch(emptyMessage())
  },[isLogginMethod])

  useEffect(()=>{
    if(localStorage.getItem('token')){
      router.push('/dashboard')
    }
  },[])

  const handleRegister=()=>{
    dispatch(registerUser({username,password,email,name}))
  }

  const handleLogin=()=>{
    dispatch(loginUser({email,password}))
  }

  return (
    <UserLayout>

        <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className={styles.cardleft_heading}> {isLogginMethod?"Sign In":"Sign Up"} </p>
            <p style={{color:authState.isError?"red":"green"}} >{authState?.message?.message}</p>
            <div className={styles.inputContainers}>
              {!isLogginMethod && <div className={styles.inputRow}>
              <input onChange={(e)=>{setusername(e.target.value)}} className={styles.inputfield} type="text" placeholder="Username" />
              <input onChange={(e)=>{setname(e.target.value)}} className={styles.inputfield} type="text" placeholder="Name" />
              </div>}
               <input onChange={(e)=>{setemail(e.target.value)}} className={styles.inputfield} type="E-mail" placeholder="E-mail" />
              <input onChange={(e)=>{setpassword(e.target.value)}} className={styles.inputfield} type="Password" placeholder="Passowrd" />

              <div onClick={()=>{
                if(isLogginMethod){
                  handleLogin()
                }else{
                  handleRegister()
                }
              }} className={styles.buttonwithoutline}>
                <p> {isLogginMethod?"Sign In":"Sign Up"} </p>
              </div>
            </div>
            
          </div>

           <div className={styles.cardContainer_right}>
              
                {isLogginMethod ? <p>Don't Have an Account?</p>:<p>Already Have an Account?</p>}
                <div onClick={()=>{
                  setislogginMethod(!isLogginMethod)
              }}style={{color:"black",textAlign:"center"}} className={styles.buttonwithoutline}>
                <p> {isLogginMethod?"Sign Up":"Sign In"} </p>
             
              </div>
           </div>
        </div>
      </div>

    </UserLayout>
  );
};

export default LoginComponent;