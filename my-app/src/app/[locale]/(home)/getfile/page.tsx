"use client"
import { ChangeEvent, useEffect, useRef, useState } from "react";
import style from "../../../style/getfile.module.css";

import { setAuth, setUserData } from '../../../festures/authSlice'
import { useAppSelector, useAppDispatch, useAppStore } from '../../../components/hooks'


import Link from "next/link";
import axios from "axios";

interface FileItem {
  filename: string;
  text: string;
  data: string;
  sentToUser: string;
  sentByUser: string;
  sentFromDevice: string;
  id: string;
}

export default function Getfile() {
  const [showPopUp, setShowPopUp] = useState(false)
  const [files, setFiles] = useState<FileItem[]>([])
  const [shareId, setShareId] = useState<String>('')
  const { isAuth, userData } = useAppSelector(state => state.authReducer)
  

  useEffect(() => {
    console.log(files);
  }, [files])

  useEffect(() => {
    console.log('New Share ID is:', shareId);
  }, [shareId])
  
  useEffect(() => {
    if (userData?.shareId != undefined) {
      setShareId(userData?.shareId)
      console.log(shareId);
      pingFileFun()
    } else {
      console.log(2);
    }
    console.log(userData?.shareId);
  }, [userData?.shareId])


  const closePopUpFun = () => {
    setShowPopUp(false)
  }
  
  const ShowPopUpFun = () => {
    console.log(1);
    setShowPopUp(true)
  }
  

  const pingFileFun = async () => {

    console.log(1);
  
    try {

      const response = await axios.get('http://localhost:7000/api/pingfiles/' + userData?.shareId)
      console.log(response.data);

      console.log(JSON.stringify(response.data) != JSON.stringify({}) && JSON.stringify(response.data) !=  JSON.stringify([]));
      
      if (JSON.stringify(response.data) != JSON.stringify({}) && JSON.stringify(response.data) != JSON.stringify([])) {
        console.log(4);
        setFiles(response.data)
        setShowPopUp(true)
      } else {
        console.log(3);
        const intervalId2 = setTimeout(() => {
          pingFileFun()
          clearTimeout(intervalId2)
          console.log(intervalId2);
        }, 5000) 
      }
    
    } catch (error) {
      console.log(error);
        if (axios.isAxiosError(error)) {
            const serverMessage = error
            console.log(serverMessage);
            
            if (serverMessage.response?.data?.msg != undefined) {
              console.log(serverMessage.response?.data?.msg);     
            } else {
              console.log(serverMessage.message)
            }
        }
    } 
    
  }






  const fileAcceptFun = async (filename: String, id: String) => {


    try {

      //Получает файл преоброзует его споиащю блоб ии создаёт ссылку

      const response = await axios.get(`http://localhost:7000/api/getFileDownload/${shareId}/${id}`)
      console.log(response.data);

      let link = document.createElement('a');
      link.download = String(filename);

      //v1

      let blob = new Blob([response.data])
      console.log(blob);

      link.href = URL.createObjectURL(blob);
      link.click();

      console.log(link);

    } catch (error) {
      console.log(error);
        if (axios.isAxiosError(error)) {
            const serverMessage = error
            console.log(serverMessage);
            
            if (serverMessage.response?.data?.msg != undefined) {
              console.log(serverMessage.response?.data?.msg);     
            } else {
              console.log(serverMessage.message)
            }
        }
    } 


    console.log({msg:'Файлы загружины'});
    // pingFileFun()


    const newFiles = files.filter((item) => item.id != id)

    if (JSON.stringify(newFiles) == JSON.stringify([])) {
      setShowPopUp(false)
    }
    setFiles(newFiles)


  }




  const filesAcceptFun = async () => {

    console.log(String(files[0]?.filename));
    

    for (let i = 0; i < files.length; i++) {

      if (files[i].text != undefined) {

        for (let i = 0; i < files.length; i++) {

          navigator.clipboard.writeText(String(files[i].text))

          const response = await axios.get(`http://localhost:7000/api/getTextDownload/${shareId}/${files[i].id}`)
          console.log(response.data);

        }

      } else if (files[i].filename != undefined) {

        try {

          //Получает файл преоброзует его споиащю блоб ии создаёт ссылку

          const response = await axios.get(`http://localhost:7000/api/getFileDownload/${shareId}/${files[i].id}`)
          console.log(response.data);

          let link = document.createElement('a');
          link.download = String(files[i].filename);

          //v1

          let blob = new Blob([response.data])
          console.log(blob);

          link.href = URL.createObjectURL(blob);
          link.click();
          
          console.log(link);

        } catch (error) {
          console.log(error);
          if (axios.isAxiosError(error)) {
            const serverMessage = error
            console.log(serverMessage);
            
            if (serverMessage.response?.data?.msg != undefined) {
              console.log(serverMessage.response?.data?.msg);     
            } else {
              console.log(serverMessage.message)
            }
          }
        } 

      }
      

      
      // let link = document.createElement('a');
      // link.download = String(files[i].filename);

      // let blob = new Blob([`http://localhost:7000/api/getFileDownload/${shareId}/${files[i].filename}`])
      // link.href = URL.createObjectURL(blob);
      // console.log(blob);

      // console.log(link);
      

      // link.click();
      
    }


    console.log({msg:'Файлы загружины'});
    setShowPopUp(false)
    setFiles([])
    // pingFileFun()

  }



  const textCopyFun = async (text: String, id: String) => {
    console.log(text);
    navigator.clipboard.writeText(String(text))
    const response = await axios.get(`http://localhost:7000/api/getTextDownload/${shareId}/${id}`)
    console.log(response.data);

    const newFiles = files.filter((item) => item.id != id)
    if (JSON.stringify(newFiles) == JSON.stringify([])) {
      setShowPopUp(false)
    }
    setFiles(newFiles)
    // pingFileFun()
  }










  const filesCancelFun = async () => {
    try {

      setFiles([])
      const response = await axios.get('http://localhost:7000/api/files/cancel/' + userData?.shareId)
      console.log(response.data);
      pingFileFun()
      setShowPopUp(false)
    
    } catch (error) {
      console.log(error);
    } 
  }

  const fileCancelFun = async (id: string) => {
    try {

      const response = await axios.get('http://localhost:7000/api/files/cancel/' + userData?.shareId + '/' +  id)
      console.log(response.data);

      pingFileFun()

      if (JSON.stringify(response.data) == JSON.stringify([])) {
        setShowPopUp(false)
      }
    
    } catch (error) {
      console.log(error);
    } 
  }


  console.log(JSON.stringify(files));
  console.log(JSON.stringify(files) != JSON.stringify([]));



  return (
    <div className={style.getfile}>

      <div className={style.blockForm}>

        <div className={style.formGetfile}>


          <div className={showPopUp != false ? (style.getFilePopUpBackground) : (style.hide)}>

            <div className={style.getFilePopUp}>

              <div className={style.acceptFiles}>

                <header className={style.getFilePopUpHeader}>

                  <h2 className={style.getFilePopUpTitle}>Принять файлы и текст</h2>

                  <button type="button" onClick={() => closePopUpFun()} className={style.buttonFilePopUpClose}>                    
                    <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#FFFFFF"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                  </button>

                </header>


                <div>

                  {
                    // showPopUp != false ? (
                      <div className={style.getFilePopUpItems}>
                        {
                          
                          files.map((file, index) => (

                            file.filename != undefined ? (
                              
                              <div key={index} className={style.fileItem}>

                                <div className={style.fileBlock}>

                                  <div className={style.fileIcon}>

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

                                  </div>

                                  <div className={style.fileName}>
                                    <span>{file.filename}</span>
                                  </div>

                                </div>

                                <div className={style.fileInfo}>
                                  <span className={style.fileInfoText}>Отправитель: {file.sentToUser}</span>
                                  <span className={style.fileInfoText}>Получатель: {file.sentByUser}</span>
                                  <span className={style.fileInfoText}>Отправлено с устройства : {file.sentFromDevice}</span>
                                  <span className={style.fileInfoText}>Время: {file.data}</span>
                                </div>


                                <div className={style.fileButtons}>
                                  <button className={style.styleButtonDownlodeCancel} type="button" onClick={() => fileCancelFun(file.id)}>
                                    Откланить
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                                  </button>
                                  <button className={style.styleButtonDownlode} type="button" onClick={() => fileAcceptFun(file.filename, file.id)}>
                                    Скачать
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
                                  </button>
                                </div>
                            
                              </div> 

                            ) : file.text != undefined ? (
                              <div key={index} className={style.textItem}>

                                
                                <div className={style.textBlock}>
                                  <span>{file.text}</span>
                                </div>

                                
                                <div className={style.fileInfo}>
                                  <span className={style.fileInfoText}>Отправитель: {file.sentToUser}</span>
                                  <span className={style.fileInfoText}>Получатель: {file.sentByUser}</span>
                                  <span className={style.fileInfoText}>Отправлено с устройства : {file.sentFromDevice}</span>
                                  <span className={style.fileInfoText}>Время: {file.data}</span>
                                </div>

                                <div className={style.fileButtons}>
                                  <button className={style.styleButtonDownlodeCancel} type="button" onClick={() => fileCancelFun(file.id)}>
                                    Откланить
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                                  </button>

                                  <button className={style.styleButtonDownlode} type="button" onClick={() => textCopyFun(file.text, file.id)}>
                                    Капировать
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>
                                  </button>
                                </div>

                                

                              </div> 
                            ) : (
                              <div></div>
                            )

                                 

                          )) 
                        }
                      </div>
                  
                    // ) : (
                    //   <div></div>
                    // )
                  }

                </div>


              </div>

              <div className={style.getFilePopUpButtonsBlock}>
  
                <div className={style.blockButtonRelodeFilePing}>
                  <button className={`${style.styleButtonSample} ${style.RelodeFilePing}`} onClick={() => pingFileFun()}>
                    Обновить
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/></svg>                  
                  </button>
                </div>


                <div className={style.getFilePopUpButtons}>

                  <button type="button" onClick={() => filesCancelFun()} className={`${style.styleButtonSample} ${style.FilseCancel}`}>
                    Откланить всё
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                  </button>

                  <button type="button" onClick={() => filesAcceptFun()} className={`${style.styleButtonSample} ${style.FilseAccept}`}>
                    Принять всё
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>                  </button>
                </div>
      
              </div>



            </div>

          </div>  


          <div className={style.formInfo}>

            <div className={style.formIcon}>

              <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="55" width="50" height="4" rx="2" fill="#008CFF"/>
                <rect x="33" y="48" width="35" height="4" rx="2" transform="rotate(-90 33 48)" fill="#96C3FF"/>
                <rect width="14.3294" height="3.82117" rx="1.91059" transform="matrix(-0.697868 0.716226 -0.697868 -0.716226 45 38.7368)" fill="#96C3FF"/>
                <rect width="14.3294" height="3.82117" rx="1.91059" transform="matrix(-0.697868 -0.716226 0.697868 -0.716226 35 49)" fill="#96C3FF"/>
              </svg>



            </div>

            <div className={style.formTitle}>
              <h2>Получить файл</h2>
              <p>Здесь вы можете принять файлы с других устройств</p>
            </div>

          </div>


          <div className={style.formData}>
            
            <div className={style.userIdBlock}>
              <p>id Вашего устройства устройства</p>
              {
                userData == null ? (
                  <h2>Загрузка...</h2>
                ) : (
                  <div className={style.userId}>

                    <h2>{userData?.shareId}</h2>

                    {
                      JSON.stringify(files) != JSON.stringify([]) ? (
                        <button type="button"  className={style.openFilePopUp} onClick={() => ShowPopUpFun()}>Открыть список файлов</button>
                      ) : (
                        <div></div>
                      )
                    }

                  </div>
                  
                )

              }
            </div>

          </div>


          <div className={style.navExchangeBlock}>

            <div className={style.navExchange}>

              <Link className={`${style.LinkExchange} ${style.select}`} href={'/getfile'}>Получить</Link>
              <Link className={`${style.LinkExchange}`} href={'/sendfile'}>Отправить</Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
