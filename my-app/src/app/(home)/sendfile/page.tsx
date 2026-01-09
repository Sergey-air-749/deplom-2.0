"use client"
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import style from "../../../style/sendfile.module.css";
import Link from "next/link";

import { useAppSelector, useAppDispatch, useAppStore } from '../../../components/hooks'
import axios from "axios";
import { useRouter } from "next/navigation";
import { io } from 'socket.io-client'
// import { useTranslations } from "next-intl";

function Sendfile() {
  const [files, setFiles] = useState<File[]>([])
  const [text, setText] = useState("")
  const [shareId, setShareId] = useState("")
  const [option, setOption] = useState("File")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [translationsLoading, setTranslationsLoading] = useState(false);

  const { isAuth, userData } = useAppSelector(state => state.authReducer)
  const route = useRouter()

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileAddInputRef = useRef<HTMLInputElement | null>(null);
  const textareaInputRef = useRef<HTMLTextAreaElement | null>(null);

  const socket = io('http://localhost:7001/');



  


  // const [uploading, setUploading] = useState(false);
  // const [uploaded, setUploaded] = useState<any[]>([]);


  // const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   const form = new FormData();

  //   files.forEach(f => form.append("files", f));

  //   const res = await fetch("http://localhost:7000/upload", {
  //     method: "POST",
  //     body: form,
  //   });

  //   const data = await res.json();
  //   console.log("RESULT:", data);
  // };












  const fileInputChange = () => {
    fileInputRef.current?.click(); 
  }

  const fileInputAddChange = () => {
    fileAddInputRef.current?.click(); 
  }

  const selectFunChange = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    setOption(e.target.value)
  }


  const authReducer = useAppSelector(state => state.authReducer)
  const dispatch = useAppDispatch()

  useEffect(() => {
    console.log(option);
  }, [option])

  useEffect(() => {
    console.log(authReducer);
  }, [authReducer])

  useEffect(() => {
    console.log(files);
  }, [files])




  // Попробовать сделать функцией

  // const t = useTranslations('ru');

  // useEffect(() => {
  //   console.log(i18n.isInitialized);
  // }, [i18n.isInitialized])

  // useEffect(() => {
  //   console.log(ready);
  // }, [ready])

  // useEffect(() => {
  //   setTranslationsLoading(true);
  // }, []);

  // if (!translationsLoading) {
  //   return null;
  // }

  // const changeLanguage = async (lang: "en" | "ru") => {
  //   await i18n.changeLanguage(lang);
  // };



  




  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(1);
    console.log(e.target.files);
    
    

    if (e.target.files != null) {
      const files = e.target.files;
      console.log(files);
      let fileFilter = []

      for (let i = 0; i < files.length; i++) {
        if (files[i].size != 0) {
          fileFilter.push(files[i])
        }

        console.log(fileFilter);
      }

      setFiles(fileFilter) 

      // for (let i = 0; i < files.length; i++) {
      //   const file = files[i];
      //   const reader = new FileReader();

      //   reader.readAsDataURL(file);

      //   reader.onload = () => {
      //     // console.log(reader.result);
      //   };
      // }   
    }
  };


  const CloseFileFun = (index: number) => {

    if (files != null) {

      let fileFilter = []

      for (let i = 0; i < files.length; i++) {
        
        if (i != index) {
          fileFilter.push(files[i])
        }

        console.log(fileFilter);
      } 

      
      if (JSON.stringify(fileFilter) == JSON.stringify([])) {
        setFiles([])
      } else {
        setFiles(fileFilter)
      }
    }

  }


  const AddFileFun = (e: ChangeEvent<HTMLInputElement>) => {

    if (e.target.files != null) {
      const filesValue = e.target.files;
      console.log(filesValue);
      let fileFilter = files

      for (let i = 0; i < filesValue.length; i++) {
        if (filesValue[i].size != 0) {
          fileFilter.push(filesValue[i])
        }

        console.log(fileFilter);
      }

      setFiles([...fileFilter]) 
    }

  }






  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (textareaInputRef.current != null) {
      textareaInputRef.current.style.height = 'auto';
      textareaInputRef.current.style.height = `${textareaInputRef.current.scrollHeight + 2}px`;
    }

    setText(e.target.value)
  }
    
  const valueShareId = (e: ChangeEvent<HTMLInputElement>) => {
    setShareId(e.target.value)
  }


  const upLoadFiles = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {

      let username = userData?.username
     
      const token = localStorage?.getItem("token")
      const date = new Date()
      let device = ""

      let minutes: string | number = date.getMinutes();

      if (minutes < 10) {
        minutes = '0' + minutes;
      }

      let dateParse = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}, ${date.getHours()}:${minutes}`

      const userAgentString = navigator.userAgent;

      if (/iPhone/i.test(userAgentString)) {
        device = "iPhone"
      } else if (/iPad/i.test(userAgentString)) {
        device = "iPad"
      } else if (/Android/i.test(userAgentString)) {
        device = "Android"
      } else if (/Windows/i.test(userAgentString)) {
        device = "Windows"
      } else {
        device = ""
      }
    

      if (option == 'Text') {

        if (text != null) {

          console.log(device);
          console.log(username);


          const obj = {
            textValue: text,
            device: device,
            data: dateParse,
            username: username,
          }

          console.log(obj);

          const response = await axios.post('http://localhost:7000/api/textLoad/' + shareId, obj, {
            headers: {
              'Content-Type': 'application/json',
              'authorization': `Bearer ${token}`,
            }
          });

          console.log('Response:', response);

          setShareId("")
          setText("")
          socket.emit('pingfiles', shareId);
          setMessage("Текст отправлены")

        }
        
      } else if (option == 'File') {
  
        if (files != null) {

          const formData = new FormData();

          for (let i = 0; i < files.length; i++) {
            console.log(files[i]);
            formData.append('files', files[i]); // "files" ключ по которому будут переданы файлы 
          }

          formData.append('device', device);
          formData.append('data', dateParse);
          formData.append('username', username as string);
         

          formData.forEach((value, key) => {
            console.log(`${key}:`, value);
          });

          console.log(device);
          console.log(username);


          const response = await axios.post('http://localhost:7000/api/fileLoadNew/' + shareId, formData, {
            headers: {
              'authorization': `Bearer ${token}`,
            }
          });

          console.log('Response:', response);

          setShareId("")
          setText("")
          setFiles([])
          socket.emit('pingfiles', shareId);
          setMessage("Файлы отправлены")

        }
          
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

  


  return (
    <div className={style.sendfile}>

      <div className={style.blockForm}>
        <form className={style.formSendFile} onSubmit={(e) => upLoadFiles(e)}>

          <div className={style.formHead}>

            <div className={style.formIcon}>

              {/* <button type="button" onClick={() => changeLanguage("en")}>EN</button>
              <button type="button" onClick={() => changeLanguage("ru")}>RU</button> */}

              <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="55" width="50" height="4" rx="2" fill="#96C3FF"/>
                <rect x="33" y="48" width="35" height="4" rx="2" transform="rotate(-90 33 48)" fill="#008CFF"/>
                <rect width="14.3294" height="3.82117" rx="1.91059" transform="matrix(0.697868 -0.716226 0.697868 0.716226 25 21.2632)" fill="#008CFF"/>
                <rect width="14.3294" height="3.82117" rx="1.91059" transform="matrix(0.697868 0.716226 -0.697868 0.716226 35 11)" fill="#008CFF"/>
              </svg>



            </div>

            <div className={style.formTitle}>
              <h2>Отпавить файл</h2>
              <p>Здесь вы можите отправить файл на другое устройства</p>
            </div>

            <div className={style.selectBlock}>
              <select className={style.selectOptionStyle} onChange={(e) => selectFunChange(e)}>
                <option value="File" defaultValue="">Отправить файл</option>
                <option value="Text">Отправить текст</option>
              </select>
            </div>

          </div>

          {
            JSON.stringify(files) != JSON.stringify([]) && option != "Text" ? (
              <div className={style.filePreview}>

                <div className={style.filePreviewTitle}>
                  <h3>Файлы</h3>
                </div>

                <div className={style.filePreviewFiles}>
                  {files.map((file, index) => (
                    <div key={index} className={style.fileItem}>

                      <div className={style.fileInfo}>

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

                          <span>{file.name}</span>

                        </div>


                      </div>


                      <div className={style.fileClose}>
                        <button type="button" onClick={() => CloseFileFun(index)} className={style.buttonFileClose}>
                          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                        </button>
                      </div>


                    </div>
                    
                  ))}

                  <div className={style.Fileblock}>
                    <button type="button" className={style.styleButton} onClick={() => fileInputAddChange()}>Добавить файл</button>
                  </div>
                  
                </div>
              </div>
            ) : option == "Text" ? (
              <div>
                
              </div>
            ) : (
              <div className={style.notFile}>
                <span>Файлов нет</span>
              </div>
            )
          }

        

          <div className={style.formInputs}>
            {
              option == "Text" ? (
                <textarea ref={textareaInputRef} value={text} placeholder="Введите текст..." onChange={(e) => handleTextChange(e)} className={style.styleTextareaInput}></textarea>
              ) : option == "File" ? (
                <div className={style.Fileblock}>
                  <input type="file" name="files" ref={fileInputRef} onChange={(e) => handleFileChange(e)} className={style.fileInput} required multiple/>
                  <input type="file" name="filesAdd" ref={fileAddInputRef} onChange={(e) => AddFileFun(e)} className={style.fileInput} multiple/>
                  <button className={style.styleButtonFileSelect} type="button" onClick={() => fileInputChange()}>Выбрать файл</button>
                </div>
                
              ) : (
                null
              )
            }
            <input type="tel" value={shareId} name="userId" onChange={(e) => valueShareId(e)} placeholder="id Устройства" className={` ${style.styleInput} `} required/>
          </div>

          <div className={style.formButtons} style={{color: 'white' }}>
            <button className={style.styleButton} type="submit">Отправить</button>
            <span className={style.message}>{ message }</span>
            <span className={style.error}>{ error }</span>
          </div>

          <div className={style.navExchangeBlock}>

            <div className={style.navExchange}>

              <Link className={`${style.LinkExchange}`} href={'/getfile'}>Получить</Link>
              <Link className={`${style.LinkExchange} ${style.select}`} href={'/sendfile'}>Отправить</Link>

            </div>

          </div>

        </form>

      </div>

    </div>
  );
}

// export default dynamic(() => Promise.resolve(Sendfile), { ssr: false });
export default Sendfile