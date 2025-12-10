const express = require('express')   
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const nodemailer = require('nodemailer');
const router = express.Router()
require('dotenv').config();

const Users = require('../moduls/users')
const authMidelwares = require('../midelwares/authMidelwares')


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


async function sendVerificationSingUpCode(recipientEmail, code) {
    let mailOptions = {
        from: '"Ваше приложение" <no-reply@yourdomain.com>',
        to: recipientEmail,
        subject: 'Подтверждение адреса электронной почты',
        text: `Ваш код подтверждения: ${code}. Он действует 10 минут.`,
        html: `<p>Ваш код подтверждения: <b>${code}</b>. Он действует 10 минут.</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Код подтверждения отправлен на:', recipientEmail);
    } catch (error) {
        console.error('Ошибка при отправке почты:', error);
        throw new Error('Не удалось отправить код подтверждения');
    }
}




// router.post('/signup/email/verify', authMidelwares, async (req, res) => {
//     try {
//         const { code } = req.body
//         const userId = req.userId
      
//         const user = await Users.findOne({_id: userId})
//         console.log(user);

//         const expirationTime = new Date(user.codeExpires)

//         if (expirationTime > new Date()) {

//             if (user.verificationCode != code) {
//                 res.status(400).json({ msg: 'Неверный код подтверждения.' });
//             } else {

//                 user.isVerified = undefined

//                 await user.save()

//                 res.status(200).json({msg: 'Адрес эл. почты изменён'});
//             }

//         } else {

//             user.verificationCode = undefined
//             user.codeExpires = undefined

//             await user.save()

//             res.status(400).json({ msg: 'Срок действия кода истёк. Запросите новый код.' });
//         }

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({msg: error.message})
//     }
// })

router.post('/signup', async (req, res) => {
    try {
        const {email, username, password} = req.body

        console.log(req.body);
        

        const existingUserEmail = await Users.findOne({email})
        console.log(existingUserEmail);

        const existingUserUsername = await Users.findOne({username})
        console.log(existingUserUsername);

        if (existingUserEmail != null) {
            res.status(400).json({msg: "Полизователь уже существует"})
            
        } else if (existingUserUsername != null) {
            res.status(400).json({msg: `Имя пользователя ${username} уже зането`})
            
        } else {
            const hashed = await bcrypt.hash(password, 10)
            const shareId = Math.floor(Math.random() * 99999999)
            const code = Math.floor(Math.random() * 999999)

            const expirationTime = new Date();
            expirationTime.setTime(expirationTime.getTime() + (10 * 60 * 1000));

            const newUser = new Users(
                {
                    email: email,
                    username: username, 
                    password: hashed,
                    shareId: shareId,
                    avatar: { 
                        '400': "http://localhost:7000/api/images/avatars/default", 
                        '1000': "http://localhost:7000/api/images/avatars/default" 
                    },
                    isVerified: false,
                    verificationCode: code,
                    codeExpires: expirationTime,
                }
            )
            await newUser.save()
            console.log(newUser);

            sendVerificationSingUpCode(email, code)
            
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET_KEY, {expiresIn: "24h"})
            res.json({token: token})

        }

    } catch (error) {
        res.status(500).json({msg: error.message})
    }
})

router.post('/login', async (req, res) => {
    try {
        const {email, username, password} = req.body
        let userData = null

        if (email == '') {
            userData = await Users.findOne({username})
        } else if (username == '') {
            userData = await Users.findOne({email})
        }

        if (!userData) {
            if (email == '') {
                res.status(400).json({msg: "Неверное имя пользователя"})
            } else if (username == '') {
                res.status(400).json({msg: "Неверная Почта"})       
            }
        } else {
            if (userData.isVerified != false) {
                const passwordValed = await bcrypt.compare(password, userData.password)
                console.log(passwordValed);

                if (passwordValed != false) {
                    const token = jwt.sign({id: userData._id}, process.env.JWT_SECRET_KEY, {expiresIn: "24h"})
                    res.json({token: token})
                } else {
                    res.status(400).json({msg: "Не верный пароль"})
                }
            } else {

                const code = Math.floor(Math.random() * 999999)

                const expirationTime = new Date();
                expirationTime.setTime(expirationTime.getTime() + (10 * 60 * 1000));

                userData.verificationCode = code,
                userData.codeExpires = expirationTime,

                sendVerificationSingUpCode(email, code)

                await userData.save()


                const token = jwt.sign({id: userData._id}, process.env.JWT_SECRET_KEY, {expiresIn: "24h"})
                res.status(400).json({msg: "Почта не верифицирована", token: token})
            }

        }

    } catch (error) {
        res.status(500).json({msg: error.message})
    }
})

module.exports = router;