'use client'
import { Roboto } from "next/font/google";
import Link from "next/link";

import "../../../style/global.css";
import style from "../../../style/layout.home.module.css";
import { useAppSelector, useAppDispatch, useAppStore } from '../../../components/hooks'
import { useEffect, useState } from "react";

// import { useTranslation } from "react-i18next";
// import i18nextCF from "../../translations/i18n.client";

import { setAuth, setUserData } from '../../../festures/authSlice'
import axios from "axios";

import { useRouter, useSearchParams  } from "next/navigation";

const robotoSans = Roboto({
  weight: ["400"],
  variable: "--font-roboto",
  subsets: ["latin"],
});

const logOutFun = () => {
  localStorage.removeItem('token')
  window.location.reload()
}

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
                }
              } else {
                console.log(serverMessage.message)
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

              <div className={style.userData}>
                <div className={style.userAvatarBlock}>
                  <img className={style.userAvatarImgDesktop} src={ userData?.avatar[400] as string | undefined } alt={`Аватар пользователя ${userData?.username}`}/>
                  <span className={style.userNameText}>{userData?.username}</span>
                </div>
              </div>
              
              <button className={style.buttonLogOut} onClick={() => logOutFun()}>Выход</button>

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

                      <div className={style.userData}>

                        <div className={style.userAvatarBlock}>
                          <img className={style.userAvatarImg} src={ userData?.avatar[400] as string | undefined } alt={`Аватар пользователя ${userData?.username}`}/>
                        </div>

                        <div className={style.userInfoBlock}>
                          <h3 className={style.userName}>{ userData?.username }</h3>
                          <span className={style.userEmail}>{ userData?.email}</span>
                        </div>

                      </div>

                      <nav className={style.navBurgerMenuLinks}>
                        <a className={style.LinkBurgerMenu} href="/sendfile">Отправить</a>
                        <a className={style.LinkBurgerMenu} href="/getfile">Получить</a>
                        <a className={style.LinkBurgerMenu} href="/story">История</a>
                        <button className={style.buttonLogOutBurgerMenu} onClick={() => logOutFun()}>Выход</button>

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
