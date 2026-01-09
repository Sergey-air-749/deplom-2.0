"use client"
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import style from "../../../../style/recovering.successfully.module.css"
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAppSelector } from "../../../../components/hooks";

export default function RecoverSuccessfully() {

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

    return (
        <div className={style.recoverAccountSuccessfully}>
            
            <form className={style.recoverAccountSuccessfullyForm}>

                <div className={style.content}>

                    <main>

                        <div className={style.recoverAccountSuccessfullyMainHead}>

                            <div className={style.formIcon}>
                                
                                <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M54 49.5C54 54.1944 45.4934 58 35 58C24.5066 58 16 54.1944 16 49.5C16 47.0553 18.3069 44.8517 22 43.301C25.3986 41.874 29.9712 41 35 41C45.4934 41 54 44.8056 54 49.5Z" fill="#96C3FF"/>
                                    <circle cx="35" cy="30" r="8" fill="#96C3FF"/>
                                    <circle cx="35" cy="35" r="23.5" stroke="#008CFF" strokeWidth="3"/>
                                    <circle cx="52" cy="51" r="9" fill="white" stroke="white" strokeWidth="2"/>
                                    <rect x="46.6445" y="45.0312" width="5.0003" height="1.36374" rx="0.681871" transform="rotate(80 46.6445 45.0312)" fill="#008CFF"/>
                                    <rect x="51.0928" y="49.3242" width="4.99997" height="1.36383" rx="0.681916" transform="rotate(170 51.0928 49.3242)" fill="#008CFF"/>
                                    <path d="M57.1702 50.0883C57.5782 50.0164 57.8551 49.6253 57.7329 49.2295C57.4074 48.1756 56.7959 47.2268 55.96 46.4924C54.9354 45.5923 53.6346 45.068 52.2722 45.0062C50.9097 44.9443 49.5668 45.3485 48.4648 46.1521C47.5658 46.8076 46.8709 47.6972 46.4512 48.7172C46.2936 49.1003 46.5339 49.5149 46.9337 49.6235V49.6235C47.3334 49.7321 47.7399 49.4922 47.9133 49.1161C48.2329 48.423 48.7253 47.8185 49.3486 47.364C50.1751 46.7614 51.1823 46.4582 52.2041 46.5046C53.226 46.551 54.2015 46.9442 54.97 47.6193C55.5495 48.1284 55.9852 48.775 56.2406 49.4942C56.3792 49.8845 56.7623 50.1603 57.1702 50.0883V50.0883Z" fill="#008CFF"/>
                                    <rect x="57.3555" y="56.9688" width="5.0003" height="1.36374" rx="0.681871" transform="rotate(-100 57.3555 56.9688)" fill="#008CFF"/>
                                    <rect x="52.9072" y="52.6758" width="4.99997" height="1.36383" rx="0.681916" transform="rotate(-9.99999 52.9072 52.6758)" fill="#008CFF"/>
                                    <path d="M46.8298 51.9117C46.4218 51.9836 46.1449 52.3747 46.2671 52.7705C46.5926 53.8244 47.2041 54.7732 48.04 55.5076C49.0646 56.4077 50.3654 56.932 51.7278 56.9938C53.0903 57.0557 54.4332 56.6515 55.5352 55.8479C56.4342 55.1924 57.1291 54.3028 57.5488 53.2828C57.7064 52.8997 57.4661 52.4851 57.0663 52.3765V52.3765C56.6666 52.2679 56.2601 52.5078 56.0867 52.8839C55.7671 53.577 55.2747 54.1814 54.6514 54.636C53.8249 55.2386 52.8177 55.5418 51.7959 55.4954C50.774 55.449 49.7985 55.0558 49.03 54.3807C48.4505 53.8716 48.0148 53.225 47.7594 52.5058C47.6208 52.1155 47.2377 51.8397 46.8298 51.9117V51.9117Z" fill="#008CFF"/>
                                </svg>

                            </div>

                            <div className={style.formTitle}>
                                <h2>Ваш аккаунт васстановлен</h2>
                            </div>

                        </div>


                        <div className={style.recoverAccountSuccessfullyInfo}>

                            <p>Ваш аккаунт, отправленные вам файлы и история, были васстановлены</p>
                        
                        </div>

                    </main>
                </div>




            </form>

        </div>
    );
}