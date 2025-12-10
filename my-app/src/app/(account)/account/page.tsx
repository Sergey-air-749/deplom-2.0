"use client"
import { useState, useEffect, ChangeEvent, useRef, FormEvent } from "react"
import style from "../../../style/account.module.css";
import { useAppSelector, useAppDispatch, useAppStore } from '../../../components/hooks'
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Account() {

    const [fileAvatar, setFileAvatar] = useState<File[]>([])
    const [showAvatarPreviwePopUp, setAvatarPreviweShowPopUp] = useState(false)
    const [deleteAccountPopUp, setDeleteAccountPopUp] = useState(false)
    const [filePreviwe, setFilePreviwe] = useState<string | ArrayBuffer | null>(null)
    const [error, setError] = useState('')

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const fileInputChange = () => {
        fileInputRef.current?.click(); 
    }

    const { isAuth, userData } = useAppSelector(state => state.authReducer)
    const router = useRouter()

    
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(1);
        console.log(e.target.files);
        
        

        if (e.target.files != null) {
            const files = e.target.files;
            console.log(files);
            let fileFilter = []

            if (files[0].size != 0 || files[0].size != undefined) {
                fileFilter.push(files[0])
            }

            setFileAvatar(fileFilter) 

            const file = files[0];
            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onload = () => {
                console.log(reader.result);
                setFilePreviwe(reader.result)      
            };  

            showAvatarFullViewPopUp()    

        }
    };



    const upLoadAvatar = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        try {

            if (fileAvatar != null) {

                const token = localStorage?.getItem("token")

                const formData = new FormData();
                formData.append('avatar', fileAvatar[0]);

                formData.forEach((value, key) => {
                    console.log(`${key}:`, value);
                });


                const response = await axios.post('http://localhost:7000/api/change/avatar', 
                    formData, 

                    {
                        headers: {
                            'authorization': `Bearer ${token}`,
                        }
                    });

                console.log(response);
                closeAvatarFullViewPopUp()
                // location.reload()
                
                    
            } else {

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

    const setDefaultAvatar = async () => {

        const token = localStorage?.getItem("token")

        const response = await axios.post('http://localhost:7000/api/change/avatar/default', 
            {},
            {
                headers: {
                    'authorization': `Bearer ${token}`,
                }
            }
        );

        console.log(response);
        closeAvatarFullViewPopUp()
        location.reload()
    }
    


    const showAvatarFullViewPopUp = () => {
        setAvatarPreviweShowPopUp(true)
    }

    const closeAvatarFullViewPopUp = () => {
        setAvatarPreviweShowPopUp(false)
        setFilePreviwe(null) 
    }


    const showDeleteAccountPopUpFun = () => {
        setDeleteAccountPopUp(true)
    }

    const closeDeleteAccountPopUpFun = () => {
        setDeleteAccountPopUp(false)
    }
    

    const logOutFun = () => {
        localStorage.removeItem('token')
        window.location.reload()
    }

    const buttonBackPage = () => {
        router.push('/sendfile')
    }



    return (
        <div className={style.account}>

            <div className={style.accountBlock}>


                {
                    showAvatarPreviwePopUp != false ? (
                        <div className={style.avatarPreviweBackground}>

                            <form className={style.avatarPreviwe} onSubmit={(e) => upLoadAvatar(e)}>

                                <div className={style.avatarPreviweHead}>

                                    <div className={style.previweHeadTitle}>
                                        <h2>Ваша аватарка</h2>
                                    </div>

                                    <div className={style.previweHeadButtonClose}>

                                        <button type="button" onClick={() => closeAvatarFullViewPopUp()} className={style.styleButtonPopUpClose}>

                                            <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#FFFFFF">
                                                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                                            </svg>

                                        </button>

                                    </div>

                                </div>

                                <div className={style.avatarPreviweImgBlock}>

                                    <div className={style.avatarPreviweImgMask} style={{backgroundImage: `url(${String(filePreviwe == null ? userData?.avatar[1000] : filePreviwe)})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', backgroundSize: 'cover'}}>
    
                                    </div>

                                    <span className={style.colorRed}>{ error }</span>
                                    
                                </div>

                                {
                                    filePreviwe == null ? (
                                        <div className={style.avatarPreviweButtons}>
                                            <button type="button" onClick={() => fileInputChange()} className={style.styleButtonSave}>Изменить</button>
                                            <button type="button" onClick={() => setDefaultAvatar()} className={style.styleButtonCancel}>Удалить</button>
                                        </div>
                                    ) : (
                                        <div className={style.avatarPreviweButtons}>
                                            <button type="submit" className={style.styleButtonSave}>Сохранить</button>
                                        </div>
                                    )
                                }

                               

                            </form>

                        </div>
                    ) : (
                        <div></div>
                    )
                }


                {
                    deleteAccountPopUp != false ? (
                        <div className={style.deleteAccountBackground}>

                            <form className={style.deleteAccount} onSubmit={(e) => upLoadAvatar(e)}>

                                <div className={style.deleteAccountInfo}>
                                    <h2>Удалить аккаунт</h2>
                                    <p>Ваш аккаунт будет навсегда и без возвратно удалён</p>
                                </div>

                                <div className={style.deleteAccountButtons}>
                                    <button type="submit" className={style.styleButtonDelete}>Удалить</button>
                                    <button type="button" onClick={() => closeDeleteAccountPopUpFun()} className={style.styleButtonCancel}>Отмена</button>
                                </div>

                            </form>

                        </div>
                    ) : (
                        <div></div>
                    )
                }

                





                <header className={style.accountHeader}>
    
                    <div className={style.buttonBackPageBlock}>
                        <button type="button" onClick={() => buttonBackPage()} className={style.buttonBackPage}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px" fill="#ffffff"><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/></svg>
                        </button>
                    </div>           
                            
                    <div className={style.headerTitle}>
                        <h2>Аккаунт</h2>
                    </div>

                </header>

                { 

                    isAuth == false ? (
                        <div className={style.loadingBlock}>
                            <span className={style.loading}>Загрузка...</span>
                        </div>
                    ) : (
            
                    <div className={style.accountInfo}>


                        <div className={style.accountInfoBlock}>

                            <div className={style.userData}>

                                <div className={style.userAvatarBlock}>
                                    <img onClick={() => showAvatarFullViewPopUp()} className={style.avatarEdit} src={'./avatarEditNew.svg'} alt={''}/>
                                    <img className={style.userAvatarImg} src={ userData?.avatar[400] as string | undefined } alt={`Аватар пользователя ${userData?.username}`}/>
                                </div>

                                <div className={style.userInfoBlock}>
                                    <h3 className={style.userName}>{ userData?.username }</h3>
                                    <span className={style.userEmail}>{ userData?.email}</span>
                                </div>
     
                                <form className={style.hide}>
                                    <input type="file" ref={fileInputRef} accept="image/*" onChange={(e) => handleFileChange(e)}/>
                                </form>

                            </div>

                        </div>
                        


                        <div className={style.accountSetting}>

                            <div className={style.links}>
                                <Link className={style.link} href={'/change/email'}>Изменить адрес эл. почты</Link>
                                <Link className={style.link} href={'/change/name'}>Изменить имя пользователя</Link>
                                <Link className={style.link} href={'/change/password'}>Изменить пароль</Link>
                                {/* <button className={`${style.colorRed} ${style.linkButton}`} onClick={() => showDeleteAccountPopUpFun()}>Удалить аккаунт</button> */}
                            </div>

                        </div>

                        <div className={style.accountSettingDop}>
                            <button className={style.buttonLogOut} onClick={() => logOutFun()}>Выход</button>
                        </div>

                    </div>
                

                    )
                        
                }

            </div>

        </div>

    )

}