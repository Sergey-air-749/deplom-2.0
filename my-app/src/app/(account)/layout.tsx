'use client'

import "../../style/global.css";
import style from "../../style/layout.account.module.css";
import { useAppSelector, useAppDispatch, useAppStore } from '../../components/hooks'
import { useEffect, useState } from "react";

import { setAuth, setUserData } from '../../festures/authSlice'
import axios from "axios";

import { useRouter, useSearchParams  } from "next/navigation";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { isAuth, userData } = useAppSelector(state => state.authReducer)
  const dispatch = useAppDispatch()
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log(isAuth);
  }, [isAuth])

  console.log(router);

  useEffect(() => {
    const token = localStorage?.getItem("token")

    const getUserData = async () => {

      try {

        const response = await axios.get('http://localhost:7000/api/getUserData', {
          headers: {
            'authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        console.log('Response:', response.data);

        dispatch(setUserData(response.data))
        dispatch(setAuth())

      } catch (error) {
          console.log(error);
          if (axios.isAxiosError(error)) {
              const serverMessage = error
              console.log(serverMessage);
              
              if (serverMessage.response?.data?.msg != undefined) {
                console.log(serverMessage.response?.data?.msg);   
                
                if (serverMessage.response?.data?.msg == "invalid token") {
                  router.push('/login')
                } else if (serverMessage.response?.data?.msg == "invalid data") {
                  router.push('/login')
                }
              } else {
                console.log(serverMessage.message)
              }
          }
      }
    }

    if (token != null) {
      getUserData()
    } else {
      router.push('/login')
    }
  }, [])

  return (
    <div className={style.accountLayout}>
      { children }
    </div>
  );
}
