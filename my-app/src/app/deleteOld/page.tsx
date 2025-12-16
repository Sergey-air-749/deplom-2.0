"use client"
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import style from "../../../style/delete.account.module.css"
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAppSelector } from "../../../components/hooks";

export default function DeleteAccount() {

    const { isAuth, userData } = useAppSelector(state => state.authReducer)
    
    const [isVerify, setIsVerify] = useState(false)
    const [error, setError] = useState("")

    const router = useRouter()


    useEffect(() => {

        const verifySession = async () => {
            try {

                const token = localStorage?.getItem('token')

                const response = await axios.get('http://localhost:7000/api/get/session',

                    {
                        headers: {
                            'authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }, 
                    }
                );

                const localSession = localStorage.getItem('session')
                const serverSession = response.data.sessionId

                console.log(response);
                console.log(localSession);
                
                if (localSession != serverSession) {
                    router.back()
                } else {
                    setIsVerify(true)
                }

            } catch (error) {
                console.log(error);
                if (axios.isAxiosError(error)) {
                    const serverMessage = error
                    console.log(serverMessage);
                    
                    if (serverMessage.response?.data?.msg != undefined) {
                        console.log(serverMessage.response?.data?.msg);     
                        setError(serverMessage.response?.data?.msg)
                    } else {
                        console.log(serverMessage.message)
                        setError(serverMessage.message)
                    }
                }
            }
        }

        verifySession()

    }, [])







    const submitUserUpData = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

            try {
            
                const token = localStorage?.getItem('token')

                const response = await axios.put('http://localhost:7000/api/change/email',

                    {
                        headers: {
                            'authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }, 
                    }
                );
                console.log('Response:', response);

                location.pathname = '/change/email/verification/'
                

            } catch (error) {
                console.log(error);
                if (axios.isAxiosError(error)) {
                    const serverMessage = error
                    console.log(serverMessage);
                    
                    if (serverMessage.response?.data?.msg != undefined) {
                        console.log(serverMessage.response?.data?.msg);     
                        setError(serverMessage.response?.data?.msg)
                    } else {
                        console.log(serverMessage.message)
                        setError(serverMessage.message)
                    }
                }
            }
    }


    const buttonBackPage = () => {
        router.back()
    }


    return (
        <div className={style.deleteAccount}>

            <div className={style.deleteAccountBlock}>



                <header className={style.deleteAccountHead}>

                    <div className={style.buttonBackPageBlock}>
                        <button type="button" onClick={() => buttonBackPage()} className={style.buttonBackPage}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px" fill="#ffffff"><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/></svg>
                        </button>
                    </div>           
                            
                    <div className={style.headerTitle}>
                        <h2>Аккаунт</h2>
                    </div>
                   
                </header>



                <div className={style.content}>

                    <main>

                        <div className={style.deleteAccountMainHead}>

                            <div className={style.formIcon}>

                                <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M54 49.5C54 54.1944 45.4934 58 35 58C24.5066 58 16 54.1944 16 49.5C16 47.0553 18.3069 44.8517 22 43.301C25.3986 41.874 29.9712 41 35 41C45.4934 41 54 44.8056 54 49.5Z" fill="#96C3FF"/>
                                    <circle cx="35" cy="30" r="8" fill="#96C3FF"/>
                                    <circle cx="35" cy="35" r="23.5" stroke="#008CFF" strokeWidth="3"/>
                                    <circle cx="52" cy="51" r="8" fill="white" stroke="white" strokeWidth="2"/>
                                    <path d="M50.4024 54.6395L47.7522 55.1684L48.2811 52.5182L54.8923 45.907L57.0136 48.0283L50.4024 54.6395Z" fill="white" stroke="#008CFF"/>
                                    <rect x="57.7207" y="48.0283" width="3" height="4" rx="0.2" transform="rotate(135 57.7207 48.0283)" fill="#008CFF"/>
                                </svg>

                            </div>

                            <div className={style.formTitle}>
                                <h2>Удалить аккаунт</h2>
                            </div>

                        </div>


                        <div className={style.deleteAccountInfo}>

                            <h3>Внимательно прочтите это перед тем как удалить аккаунта</h3>

                            <p>Ваш данные аккаунт, отправленные файлы и история, будет навсегда удален, отменить удаление можно в течение 14 дней</p>
                        
                        </div>

                    </main>


                    <footer className={style.styleFooter}>
                        {

                            isVerify == true ? (
                                <button className={style.styleButtonDelete}>Удалить</button>
                            ) : (
                                <div></div>
                            )

                        }
                    </footer>


                </div>


                
            </div>

        </div>
    );
}