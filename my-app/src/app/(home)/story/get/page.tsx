"use client"
import { useState, useEffect } from "react";
import style from "../../../../style/getFileStory.module.css";

import { useAppSelector, useAppDispatch, useAppStore } from '../../../../components/hooks'
import { setAuth, setUserData } from '../../../../festures/authSlice'
import { useRouter } from "next/navigation";

import Link from "next/link";
import axios from "axios";


export default function getFileStory() {

    const [showSettingsPopUp, setShowSettingsPopUp] = useState(false)
    const [showMessageSettingsPopUp, setShowMessageSettingsPopUp] = useState(false)
    const { isAuth, userData } = useAppSelector(state => state.authReducer)
    const userFileStory = userData?.filseStoryGet

    const dispatch = useAppDispatch()

    const router = useRouter()

    const getUserData = async () => {

        const token = localStorage?.getItem("token")

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
                    }
                } else {
                    console.log(serverMessage.message)
                }
            }
        }
    }

    const deleteAllFilesStory = async () => {

        closeMessageDeletePopUpFun()
        closeSettingsPopUpFun()
        const token = localStorage?.getItem("token")

        console.log(token);
        

        try {

            const response = await axios.post('http://localhost:7000/api/story/get/deleteAll/', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            })

            console.log('Response:', response.data);
            getUserData()

        } catch (error) {
            console.log(error);
            if (axios.isAxiosError(error)) {
                const serverMessage = error
                console.log(serverMessage);
                
                if (serverMessage.response?.data?.msg != undefined) {
                    console.log(serverMessage.response?.data?.msg);   
                    
                    if (serverMessage.response?.data?.msg == "invalid token") {
                        router.push('/login')
                    }
                } else {
                    console.log(serverMessage.message)
                }
            }
        }
    }


    const deleteFileStory = async (id: string) => {

        closeMessageDeletePopUpFun()
        closeSettingsPopUpFun()
        const token = localStorage?.getItem("token")

        try {

            const response = await axios.post('http://localhost:7000/api/story/get/delete/' + id, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            })

            console.log('Response:', response.data);
            getUserData()

        } catch (error) {
            console.log(error);
            if (axios.isAxiosError(error)) {
                const serverMessage = error
                console.log(serverMessage);
                
                if (serverMessage.response?.data?.msg != undefined) {
                    console.log(serverMessage.response?.data?.msg);   
                    
                    if (serverMessage.response?.data?.msg == "invalid token") {
                        router.push('/login')
                    }
                } else {
                    console.log(serverMessage.message)
                }
            }
        }
    }


    const buttonBackPage = () => {
        router.back()
    }


    const showMessageDeletePopUpFun = () => {
        setShowMessageSettingsPopUp(true)
    }

    const closeMessageDeletePopUpFun = () => {
        setShowMessageSettingsPopUp(false)
    }

    const showSettingsPopUpFun = () => {
        setShowSettingsPopUp(true)
    }

    const closeSettingsPopUpFun = () => {
        setShowSettingsPopUp(false)
    }

    return (
        <div className={style.getFileStory}>

            <div className={style.blockStory}>
                
                <div className={style.formGetFileStory}>


                    {
                        showSettingsPopUp != false ? (
                            <div className={style.settingsStoryPopUpBackground}>

                                <div className={style.settingsStoryPopUp}>

                                    <div className={style.settingsStoryPopUpHeader}>

                                        <h2>Упровление историй</h2>

                                        <button type="button" onClick={() => closeSettingsPopUpFun()} className={style.buttonFilePopUpClose}>                    
                                            <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#FFFFFF"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                                        </button>
                                        
                                    </div>

                                    <div className={style.settingsStoryPopUpOptions}>
                                        
                                        <div className={style.settingsStoryPopUpOptionBlock}>
                                            <button type="button" onClick={() => showMessageDeletePopUpFun()} className={` ${style.settingsStoryPopUpOptionButton} ${style.delete} `}>
                                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#ff7070"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                                                Очистить всю историю
                                            </button>
                                        </div>

                                    </div>
                                    
                                </div>

                            </div>
                        ) : (
                            <div></div>
                        )
                    }



                    {
                        showMessageSettingsPopUp != false ? (
                            <div className={style.messageDeleteStoryPopUpBackground}>

                                <div className={style.messageDeleteStoryPopUp}>

                                    <div className={style.messageDeleteStoryPopUpHeader}>

                                        <h2>Очистить всю историю</h2>

                                        <span>Вся ваша история будет безвозвратно удалена</span>
                                        
                                    </div>

                                    <div className={style.messageDeleteStoryPopUpOptions}>
                                        
                                        <button type="button" onClick={() => deleteAllFilesStory()} className={` ${style.messageDeletePopUpOptionButton} ${style.filesAllDelete} `}>Удалить</button>
                                        <button type="button" onClick={() => closeMessageDeletePopUpFun()} className={` ${style.messageDeletePopUpOptionButton} `}>Отмена</button>

                                    </div>
                                    
                                </div>

                            </div>
                        ) : (
                            <div></div>
                        )
                    }






                
                    <div className={style.formHead}>

                        <div className={style.navigationPage}>

                            <div className={style.buttonBackPageBlock}>
                                <button type="button" onClick={() => buttonBackPage()} className={style.buttonBackPage}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px" fill="#ffffff"><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/></svg>
                                </button>
                            </div>
                           
                           
                            <div className={style.navStoryOptionsBlock}>
                                <div className={style.navStoryOptions}>
                                    <Link className={`${style.LinkStoryOptions} ${style.select}`} href={'/story/get'}>Принятые</Link>
                                    <Link className={`${style.LinkStoryOptions}`} href={'/story/send'}>Отправленные</Link>
                                </div>
                            </div>

                        </div>

                        <div className={style.formIcon}>

                            <svg width="80" height="80" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M53 15C54.1046 15 55 15.8954 55 17V53C55 54.1046 54.1046 55 53 55H17C15.8954 55 15 54.1046 15 53V30L30 15H53ZM42 31C35.9249 31 31 35.9249 31 42C31 48.0751 35.9249 53 42 53C48.0751 53 53 48.0751 53 42C53 35.9249 48.0751 31 42 31ZM23.5996 32.001C23.0843 32.001 22.6663 32.4183 22.666 32.9336V49.4277L18.9795 45.7412C18.615 45.377 18.0246 45.377 17.6602 45.7412C17.2957 46.1057 17.2957 46.697 17.6602 47.0615L22.2793 51.6807C23.0083 52.4097 24.1909 52.4097 24.9199 51.6807L29.5391 47.0615C29.9036 46.697 29.9036 46.1057 29.5391 45.7412C29.1746 45.377 28.5841 45.3769 28.2197 45.7412L24.5322 49.4277V32.9336C24.532 32.4184 24.1148 32.0012 23.5996 32.001ZM42 33C46.9706 33 51 37.0294 51 42C51 46.9706 46.9706 51 42 51C37.0294 51 33 46.9706 33 42C33 37.0294 37.0294 33 42 33ZM42 34.1426C41.5661 34.1426 41.2139 34.4948 41.2139 34.9287V41.6436L37.8867 44.4355C37.5547 44.7144 37.5115 45.2097 37.79 45.542C38.069 45.8744 38.565 45.9176 38.8975 45.6387L42.5088 42.6084C42.7163 42.4341 42.8113 42.1755 42.7852 41.9248V34.9287C42.7852 34.4948 42.4339 34.1427 42 34.1426Z" fill="#008CFF"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M18.4133 26.5867L15.5858 29.4142L15 30H15.1796H19.8284H22.5H28C29.1046 30 30 29.1046 30 28V22.5V19.8284V15.1796V15L29.4142 15.5858L26.5862 18.4138L18.4133 26.5867Z" fill="#96C3FF"/>
                            </svg>


                        </div>

                        <div className={style.formTitle}>
                            <h2>История принятых файлов</h2>
                            <p>Здесь вы можете посмотреть все файлы которые принимали, время, от кого и скакого устройства</p>
                        </div>

                    </div>

                    <div className={style.formFileStoryView}>

                        <div className={style.formFileStoryTitleBlock}>
                            <h2>История</h2>

                            <button type="button" onClick={() => showSettingsPopUpFun()} className={style.formFileStorySettings}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#ffffff"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>
                            </button>
                        </div>

                        <div className={style.fileStoryViewBlock}>

                            {
                                JSON.stringify(userFileStory) != JSON.stringify([]) ? (

                                    userFileStory?.map((file, index) => (
                                        
                                        
                                        <div key={index} className={style.fileItem}>

                                                {

                                                    file.filename != undefined ? (

                                                        
                                                        <div className={style.fileBlock}>

                                                            <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <g clipPath="url(#clip0_103_46)">
                                                                    <path d="M100 100V0H50H37.5L0 37.5V50V100H100Z" fill="white"/>
                                                                    <path d="M50 0H37.5L0 37.5V50H50V0Z" fill="white"/>
                                                                    <path d="M8.53554 28.9645L28.9645 8.53553C32.1143 5.38571 37.5 7.61654 37.5 12.0711V32.5C37.5 35.2614 35.2614 37.5 32.5 37.5H12.0711C7.61654 37.5 5.38572 32.1143 8.53554 28.9645Z" fill="#E4E4E4"/>
                                                                    <path d="M0 37.5L37.5 0V18.75L18.75 37.5H0Z" fill="#E4E4E4"/>
                                                                </g>

                                                                <defs>
                                                                    <clipPath id="clip0_103_46">
                                                                    <rect width="100" height="100" rx="5" fill="white"/>
                                                                    </clipPath>
                                                                </defs>

                                                            </svg>
                                                                
                                                            <div className={style.fileName}>
                                                                <span>{file.filename}</span>
                                                            </div>

                                                        </div>

                                                    ) : file.text != undefined ? (
                                                        <div className={style.textBlock}>
                                                            <span>{file.text}</span>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            
                                                        </div>
                                                    )
                                                }

                                                <div className={style.fileInfo}>
                                                    <span className={style.fileInfoText}>Отправитель: {file.sentToUser}</span>
                                                    <span className={style.fileInfoText}>Получатель: {file.userWillReceive}</span>
                                                    <span className={style.fileInfoText}>Отправлено с устройства : {file.sentFromDevice}</span>
                                                    <span className={style.fileInfoText}>Время: {file.data}</span>
                                                </div>

                                                <div className={style.fileButtons}>
                                                    <button type="button" onClick={() => deleteFileStory(file.id)} className={` ${style.messageDeletePopUpOptionButton} ${style.filesAllDelete} `}>Удалить</button>
                                                </div>
                                            
                                            </div>
                                    
                                    ))

                                ) : (
                                    <div className={style.notFilesStory}>
                                        <span className={style.notFilesStorySpan}>Файлов в истории нет</span>
                                    </div>
                                )

                            }

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}