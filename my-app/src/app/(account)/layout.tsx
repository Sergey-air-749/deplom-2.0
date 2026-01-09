'use client'

import "../../style/global.css";
import style from "../../style/layout.account.module.css";
import accessdDnied from "../../style/accessd.dnied.account.module.css"
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
                
                if (serverMessage.response?.data?.msg != "invalid token" || serverMessage.response?.data?.msg != "invalid data") {

                  if (location.pathname != '/delete/successfully' && location.pathname != '/recovering/successfully') {
                    // router.push('/login')
                  }

                }
                
              } else {
                console.log(serverMessage.message)
              }
          }
      }
    }

    // if (token != null) {
      getUserData()
    // } else {
      // router.push('/login')
    // }
  }, [])

  
    if (userData != null) {

      console.log(userData?.isGuest == undefined);
    
      if (userData?.isGuest == undefined) {
  
        return (
          <div className={style.accountLayout}>
            { children }
          </div>
        );
  
      } else {
        
        return (
          <div className={accessdDnied.accountSettingAccessdDnied}>
            
            <form className={accessdDnied.accountSettingAccessdDniedForm}>

                <div className={accessdDnied.content}>

                    <main>

                        <div className={accessdDnied.accountSettingAccessdDniedMainHead}>

                            <div className={accessdDnied.formIcon}>

                                <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M54 49.5C54 54.1944 45.4934 58 35 58C24.5066 58 16 54.1944 16 49.5C16 47.0553 18.3069 44.8517 22 43.301C25.3986 41.874 29.9712 41 35 41C45.4934 41 54 44.8056 54 49.5Z" fill="#96C3FF"/>
                                    <circle cx="35" cy="30" r="8" fill="#96C3FF"/>
                                    <circle cx="35" cy="35" r="23.5" stroke="#008CFF" strokeWidth="3"/>
                                    <circle cx="52" cy="51" r="8" fill="white" stroke="white" strokeWidth="2"/>
                                    <rect x="47" y="50" width="10" height="2" rx="1" fill="#008CFF"/>
                                    <rect x="51" y="56" width="10" height="2" rx="1" transform="rotate(-90 51 56)" fill="#008CFF"/>
                                </svg>


                            </div>

                            <div className={accessdDnied.formTitle}>
                              <h2>Доступ закрыт</h2>
                            </div>

                        </div>


                        <div className={accessdDnied.accountSettingAccessdDniedInfo}>

                          <p>
                            Настройки аккаунта недоступны в гостевом режимеы
                          </p>
                        
                        </div>

                        <div className={accessdDnied.accountSettingAccessdDniedButtons}>

                          <button type="button" className={accessdDnied.styleButtonDelete}>Вернуться на главную</button>
                        
                        </div>

                    </main>
                </div>

            </form>

        </div>
        );
      }
      
    }

  

}
