"use client"
import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import style from "../../../../style/change.email.module.css"
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAppSelector } from "../../../../components/hooks";

export default function ChangeEmail() {

    const { isAuth, userData } = useAppSelector(state => state.authReducer)
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    
    const emailRegexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    const router = useRouter()

    const validationInputEmail = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        console.log(emailRegexp.test(value));   

        if (emailRegexp.test(value) == true) {
            setError("")
        } else {
            setError("Почта должна состоять от 3 символов, содержать символ @ ")
        }

        setEmail(value)
        console.log(email);
    }



    const submitUserUpData = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

            try {
            
                const token = localStorage?.getItem('token')

                const userUpData = {
                    emailNew: email,
                }

                console.log(userUpData);

                const response = await axios.put('http://localhost:7000/api/change/email',
                    userUpData,

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
        <div className={style.changeEmail}>
            
            <form className={style.formChangeEmail} onSubmit={(e) => submitUserUpData(e)}>

                <div className={style.formHead}>

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
                        <h2>Изменить адрес эл. почты</h2>
                    </div>

                </div>

                <div className={style.formInputs}>

                    <input className={style.inputStyle} value={email} onChange={(e) => validationInputEmail(e)} placeholder="Изменить адрес эл. почты" type="email" name="email" id="email" required/> 

                    {
                        userData != null ? (
                            <div className={style.currentName}>
                                <h3>Текущее эл. почта: </h3>
                                <span>{userData.email}</span>
                            </div>
                        ) : (
                            <div className={style.currentName}>
                                <span>Загрузка...</span>
                            </div>
                        )
                    }


                    <span className={style.error}>{error}</span>
                </div>

                <div className={style.formButtons}>
                    <button type="submit" className={style.buttonSubmit}>Сохранить изменения</button>
                    <button type="button" onClick={() => buttonBackPage()} className={style.buttonCancel}>Отмена</button>
                </div>

            </form>

        </div>
    );
}