"use client"
import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import style from "../../../../../style/verify.email.module.css"
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAppSelector } from "../../../../../components/hooks";

export default function SignupEmail() {

    const { isAuth, userData } = useAppSelector(state => state.authReducer)
    const [code, setCode] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    
    const router = useRouter()

    const validationInputCode = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setCode(value)
        console.log(code);
    }



    const submitUserUpData = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

            try {
            
                const token = localStorage?.getItem('token')

                const codeObj = {
                    code: code,
                }

                console.log(codeObj);

                const response = await axios.post('http://localhost:7000/api/signup/email/verify',
                    codeObj,

                    {
                        headers: {
                            'authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }, 
                    }
                );
                console.log('Response:', response);

                location.pathname = '/sendfile'
                

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

    const buttonGetТewСode = async () => {

            try {
            
                const token = localStorage?.getItem('token')

                const response = await axios.get('http://localhost:7000/api/signup/email/new',
                    {
                        headers: {
                            'authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }, 
                    }
                );
                console.log('Response:', response);  
                
                setMessage('Новый код отправлен')

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

    const buttonBackPage = async () => {

            try {
            
                const token = localStorage?.getItem('token')

                const response = await axios.get('http://localhost:7000/api/signup/email/cancel',
                    {
                        headers: {
                            'authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }, 
                    }
                );
                console.log('Response:', response);  
                
                router.push('/signup')

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

    // const buttonBackPage = () => {
    //     router.back()
    // }


    return (
        <div className={style.changeEmail}>
            
            <form className={style.formLogin} onSubmit={(e) => submitUserUpData(e)}>

                <div className={style.formHead}>

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
                        <h2>Введите код из эл. почты</h2>

                        {
                            userData != null ? (
                                <div >
                                    <p>Мы отправели код потверждения на <span>{userData?.email} потвердите почту для завершения регистрации</span></p>    
                                </div>
                            ) : (
                                <div></div>
                            )
                             
                        }
                       
                    </div>

                </div>

                <div className={style.formInputs}>
                    <input className={style.inputStyle} value={code} onChange={(e) => validationInputCode(e)} placeholder="Введите код из эл. почты" type="text" name="code" id="code" required/> 
                    <span className={style.error}>{error}</span>
                    <span className={style.message}>{message}</span>
                </div>

                <div className={style.formButtons}>
                    <button type="submit" className={style.buttonSubmit}>Отправить код</button>
                    <button type="button" onClick={() => buttonGetТewСode()} className={style.buttonGetТewСode}>Получить новый код</button>
                    <button type="button" onClick={() => buttonBackPage()} className={style.buttonCancel}>Отмена</button>
                </div>

            </form>

        </div>
    );
}