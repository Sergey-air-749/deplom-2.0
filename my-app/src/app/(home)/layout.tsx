'use client'
import { Roboto } from "next/font/google";
import Link from "next/link";

import "../../style/global.css";
import style from "../../style/layout.home.module.css";
import { useAppSelector, useAppDispatch, useAppStore } from '../../components/hooks'
import { useEffect, useState } from "react";

// import { useTranslation } from "react-i18next";
// import i18nextCF from "../../translations/i18n.client";

import { setAuth, setUserData } from '../../festures/authSlice'
import axios from "axios";

import { useRouter, useSearchParams  } from "next/navigation";

const robotoSans = Roboto({
  weight: ["400"],
  variable: "--font-roboto",
  subsets: ["latin"],
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [showBurgerMenu, setShowBurgerMenu] = useState(false)
  const { isAuth, userData } = useAppSelector(state => state.authReducer)
  const dispatch = useAppDispatch()
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log(isAuth);
  }, [isAuth])

  console.log(router);
  
  const logOutFun = () => {
    localStorage.removeItem('token')
    window.location.reload()
  }

  // console.log(searchParams.get('locale'));

  // const changeLanguageFun = async (lang: "en" | "ru") => {
  //   await i18nextCF.changeLanguage(lang);
  // };

  // useEffect(() => {
  //   changeLanguageFun("ru")
  // }, [])

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
                
                if (serverMessage.response?.data?.msg == "invalid token") {
                  router.push('/login')
                } else if (serverMessage.response?.data?.msg == "invalid data") {
                  router.push('/login')
                }
              } else {
                console.log(serverMessage.message)

                if (serverMessage.message == "Network Error") {
                  router.push('/login')
                }
              }
          }
      }
    }

    if (token != null) {
      getUserData()
    } else {
      router.push('/login')
    }
  }, [])

  return (
    <div className={style.home}>


      <header className={style.header}>

        <div className={style.headerTitle}>
          <h2>Обмен файлами</h2>
        </div>


        <nav className={`${style.nav} ${style.desktopMenu}`}>

          { 

          isAuth == false ? (
            <div></div>
            // <nav className={style.nav}>
            //   <Link className={style.Link} href="/login">Вход</Link>
            //   <Link className={style.Link} href="/signup">Регистрация</Link>
            // </nav>
          ) : (
            <nav className={style.nav}>

              <Link className={style.Link} href="/sendfile">Отправить</Link>
              <Link className={style.Link} href="/getfile">Получить</Link>
              <Link className={style.Link} href="/story">История</Link>

              <Link className={style.accountSettingLink} href={'/account'}>
                <div className={style.userData}>
                  <div className={style.userAvatarBlock}>
                    <img className={style.userAvatarImgDesktop} src={ userData?.avatar[400] as string | undefined } alt={`Аватар пользователя ${userData?.username}`}/>
                    <span className={style.userNameText}>{userData?.username}</span>
                  </div>
                </div>
              </Link>
              
              {/* <button className={style.buttonLogOut} onClick={() => logOutFun()}>Выход</button> */}

            </nav>
          )
          
          }

        </nav>

        <nav className={`${style.nav} ${style.mobileMenu}`}>
          <button type="button" className={style.burgerMenuButton} onClick={() => setShowBurgerMenu(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
          </button>
        </nav>

      </header>


      <main>
        {children}

        {

          showBurgerMenu == true ? (
            <div className={style.burgerMenuBackground}>
              <div className={style.burgerMenu}>

                <div className={style.burgerMenuHead}>

                  <h2 className={style.burgerMenuTitle}>Меню</h2>

                  <button type="button" className={style.burgerMenuButtonClose} onClick={() => setShowBurgerMenu(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffffff">
                      <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                    </svg>
                  </button>

                </div>
                
                <nav className={style.navBurgerMenu}>

                  { 

                  isAuth == false ? (
                    <div></div>
                    // <nav className={style.navBurgerMenu}>
                    //   <Link className={style.LinkBurgerMenu} href="/signup">Регистрация</Link>
                    //   <Link className={style.LinkBurgerMenu} href="/login">Вход</Link>
                    //   <Link className={style.LinkBurgerMenu} href="/story">История</Link>
                    // </nav>
                  ) : (
                    <nav className={style.navBurgerMenu}>

                      <Link className={style.accountSettingLink} href={'/account'}>

                        <div className={style.userDataBlock}>

                          <div className={style.userData}>

                            <div className={style.userAvatarBlock}>
                              <img className={style.userAvatarImg} src={ userData?.avatar[400] as string | undefined } alt={`Аватар пользователя ${userData?.username}`}/>
                            </div>

                            <div className={style.userInfoBlock}>
                              <h3 className={style.userName}>{ userData?.username }</h3>
                              <span className={style.userEmail}>{ userData?.email}</span>
                            </div>

                          </div>

                          <div className={style.accountSettingBlock}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#ffffff"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>
                          </div>

                        </div>

                      </Link>

                      <nav className={style.navBurgerMenuLinks}>
                        <a className={style.LinkBurgerMenu} href="/sendfile">Отправить</a>
                        <a className={style.LinkBurgerMenu} href="/getfile">Получить</a>
                        <a className={style.LinkBurgerMenu} href="/story">История</a>
                        {/* <button className={style.buttonLogOutBurgerMenu} onClick={() => logOutFun()}>Выход</button> */}

                        {/* <button onClick={() => changeLanguageFun("en")}>EN</button>
                        <button onClick={() => changeLanguageFun("ru")}>RU</button> */}
                      </nav>

                    </nav>
                  )
                  
                  }

                </nav>
                
              </div>
            </div>
          ) : (
            <div>

            </div>
          )

          
      }
                

      </main>
    </div>
  );
}
