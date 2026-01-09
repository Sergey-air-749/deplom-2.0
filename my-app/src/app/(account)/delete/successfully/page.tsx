"use client"
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import style from "../../../../style/delete.account.successfully.module.css"
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAppSelector } from "../../../../components/hooks";

export default function SignupEmail() {

    const { isAuth, userData } = useAppSelector(state => state.authReducer)
    const [password, setPassword] = useState("")
    const [showPasswordStatus, setShowPasswordStatus] = useState("password")
    const [isVerify, setIsVerify] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    const router = useRouter()

    const validationInputPassword = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        console.log(passwordRegexp.test(value)); 
        setPassword(value)  
    }



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
                        if (serverMessage.response?.data?.msg == 'Нет сессий') {
                            location.pathname = '/delete/verification'
                        }
                        setError(serverMessage.response?.data?.msg)
                    } else {
                        console.log(serverMessage.message)
                        setError(serverMessage.message)
                    }
                }
            }
        }

        // verifySession()

    }, [])


    const buttonBackPage = async () => {
        router.back
    }

    const showPasswordFun = () => {
        if (showPasswordStatus == "password") {
            setShowPasswordStatus("text")
        } else {
            setShowPasswordStatus("password")
        }
    }


    return (
        <div className={style.deleteAccountSuccessfully}>
            
            <form className={style.deleteAccountSuccessfullyForm}>

                <div className={style.content}>

                    <main>

                        <div className={style.deleteAccountSuccessfullyMainHead}>

                            <div className={style.formIcon}>

                                <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M54 49.5C54 54.1944 45.4934 58 35 58C24.5066 58 16 54.1944 16 49.5C16 47.0553 18.3069 44.8517 22 43.301C25.3986 41.874 29.9712 41 35 41C45.4934 41 54 44.8056 54 49.5Z" fill="#96C3FF"/>
                                    <circle cx="35" cy="30" r="8" fill="#96C3FF"/>
                                    <circle cx="35" cy="35" r="23.5" stroke="#008CFF" strokeWidth="3"/>
                                    <circle cx="52" cy="51" r="8" fill="white" stroke="white" strokeWidth="2"/>
                                    <rect x="47" y="50" width="10" height="2" rx="1" fill="#008CFF"/>
                                    <rect x="51" y="56" width="10" height="2" rx="1" transform="rotate(-90 51 56)" fill="#008CFF"/>
                                </svg>


                            </div>

                            <div className={style.formTitle}>
                                <h2>Ваш аккаунт удален</h2>
                            </div>

                        </div>


                        <div className={style.deleteAccountSuccessfullyInfo}>

                            <p>Ваш данные аккаунт, отправленные файлы и история, были удалены, отменить удаление можно в течение 14 дней</p>
                        
                        </div>

                    </main>
                </div>




            </form>

        </div>
    );
}