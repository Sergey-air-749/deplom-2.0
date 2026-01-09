const express = require('express')  
const router = express.Router()
require('dotenv').config();
const path = require('path');
const { 
    S3Client,
    GetObjectCommand,
    PutObjectCommand,
    DeleteObjectCommand,
    ListObjectsV2Command,
} = require('@aws-sdk/client-s3')

const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const multerS3 = require('multer-s3')

const Users = require('../moduls/users')

const authMidelwares = require('../midelwares/authMidelwares')
const multer = require('multer');
const cron = require("node-cron");


const s3Client = new S3Client({
    region: process.env.region,
    credentials: {
      accessKeyId: process.env.accessKeyId,
      secretAccessKey: process.env.secretAccessKey,
    }
})






const generateFilename = (fileName) => {
    const randomNameId = Math.floor(Math.random() * 9999999999)

    const lastDotIndex = fileName.lastIndexOf('.');

    if (lastDotIndex === -1 || lastDotIndex === 0) {
        return `${randomNameId}`;
    }

    const fileExtension = fileName.substring(lastDotIndex + 1)

    console.log(`${randomNameId}.${fileExtension}`);
    return `${randomNameId}.${fileExtension}`;
}


// Ты зарание позоботился о том с каким названиям будут сохраниться
// поэтому в будующем в "/fileLoad/:id/" upload.array('files') req.files 
// возвращает файлы с изменённым названием

const uploadS3 = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'sergay-air-bucket-one',

    key: function (req, file, cb) {
      const fileName = generateFilename(file.originalname)
      cb(null, file.originalname = fileName);
      cb(null, file.key = 'files/' + fileName);
      console.log('key');
      console.log(file);
    },

  })
})



router.post('/fileLoadNew/:id/', uploadS3.array('files'), authMidelwares, async (req, res) => {
    try {

        const userId = req.userId
    
        const { id } = req.params
        const { sentToUserId, data, device, username } = req.body

        console.log(id);  
        console.log(device);  
        console.log(data);  
        console.log(username);

        console.log(req.files);

        const userWillReceive = await Users.findOne({shareId: id})
        const sentToUser = await Users.findOne({_id: userId})

        let filseStorySendNew = sentToUser.filseStorySend

        const expirationTime = new Date();
        expirationTime.setDate(expirationTime.getDate() + 14);

        req.files.forEach(async (item, index) => {

            const obj = {
                id: Math.floor(Math.random() * 9999999999),
                filename: item.originalname,
                sentFromDevice: device,
                data: data,
                status: 'sent',
                sentToUserId: sentToUserId,
                sentToUser: username,
                userWillReceive: userWillReceive.username,
                expirationTime: expirationTime
            }

            // console.log(obj);

            userWillReceive.filse.push(obj)
            filseStorySendNew.unshift(obj)
            console.log(sentToUser.filseStorySend);
        })

        // console.log(user);
        await userWillReceive.save()
        await Users.findByIdAndUpdate({_id: userId}, {filseStorySend: filseStorySendNew})


        res.status(200).send({msg:'Файлы успешно загружены!'});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error.message})
    }
});








router.post('/textLoad/:id', authMidelwares, async (req, res) => {

    console.log(req.body);

    try {
        const { id } = req.params
        const { sentToUserId, textValue, data, device, username } = req.body
        const userId = req.userId

        const user = await Users.findOne({shareId: id})
        const sentToUsername = await Users.findOne({_id: userId})

        const expirationTime = new Date();
        expirationTime.setDate(expirationTime.getDate() + 14);

        const obj = {
            id: Math.floor(Math.random() * 9999999999),
            text: textValue,
            sentFromDevice: device,
            data: data,
            status: 'sent',
            sentToUserId: sentToUserId,
            sentToUser: username,
            userWillReceive: user.username,
            expirationTime: expirationTime
        }

        console.log(obj);

        user.filse.push(obj)
        sentToUsername.filseStorySend.push(obj)

        console.log(user);
        await user.save()
        await sentToUsername.save()


        res.status(200).send({msg:'Текст успешно загружены!'});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error.message})
    }
});










// router.get('/pingfiles/:shareId', async (req, res) => {  // <--- Добавить authMidelwares
//     try {
//         const { shareId } = req.params
//         const user = await Users.findOne({shareId: shareId})
        
//         console.log(JSON.stringify(user.filse));  
//         res.send(user.filse);
//     } catch (error) {
//         console.log(error);  
//         res.send(error);
//     }
// });




// Скачивание файла и перемещение в историю

router.get('/getDownloadNew/:option/:shareId/:fileId', async (req, res) => {
    try {
        console.log(req.params);
        
        const { shareId, fileId, option } = req.params
    
        const userShareId = await Users.findOne({shareId: shareId})
        const filse = userShareId.filse

        const getFile = filse.find((item) => item.id == fileId)
        const deleteFile = filse.filter((item) => item.id != fileId)
        
        if (option == 'file') {
            if (getFile != undefined) {

                getFile.status = 'accepted'
                userShareId.filseStoryGet.unshift(getFile)
                userShareId.filse = deleteFile

                await userShareId.save()


                const sentToUserId = await Users.findOne({shareId: getFile.sentToUserId})
                const filseStorySendNew = sentToUserId.filseStorySend
                
                const reStatus = filseStorySendNew.find(file => file.id == fileId)

                reStatus.status = 'accepted'
                const user = await Users.findOneAndUpdate({shareId: getFile.sentToUserId}, {filseStorySend: filseStorySendNew})
                console.log("Обновленный объект", user);
                console.log(filseStorySendNew);
                





                // await sentToUserId.save()

                console.log(sentToUserId);
                

                // console.log(getFile.filename);

                const command = new GetObjectCommand({
                    Bucket: 'sergay-air-bucket-one',
                    Key: 'files/' + getFile.filename
                })

                const url = await getSignedUrl(s3Client, command) 

                res.send({url: url});
            } else {
                res.send({msg:'Файл не найден'});
            }            
        } else if (option == 'text') {

            if (getFile != undefined) {
                userShareId.filseStoryGet.unshift(getFile)
                userShareId.filse = deleteFile
                await userShareId.save()

                res.send({msg:'Текст принет'});
            } else {
                res.send({msg:'Текст не найден'});
            }

        }

    } catch (error) {
        console.log(error);  
        res.status(500).send(error);
    }
});









router.get('/files/cancel/:shareId', async (req, res) => {  // <--- Добавить authMidelwares
    try {
        const { shareId } = req.params
        const user = await Users.findOne({shareId: shareId})

        user.filse.forEach((file, index) => {

            file.status = 'refusal'

        });

        await user.save()
        
        res.send({msg: 'Загрузка отменена'});
    } catch (error) {
        console.log(error);  
        res.send(error);
    }
});


router.get('/files/cancel/:shareId/:id', async (req, res) => {  // <--- Добавить authMidelwares
    try {
        const { shareId, id } = req.params
        const user = await Users.findOne({shareId: shareId})

        const newFilseFind = user.filse.find((item) => item.id != id)
        const newFilseFilter = user.filse.filter((item) => item.id != id)

        const sentToUser = await Users.findOne({shareId: newFilseFind.sentToUserId})

        if (sentToUser != null) {
           
            const newFilseFind = sentToUser.filseStorySend.find((item) => item.id != id)
            
            if (sentToUser != null) {
                newFilseFind.status = 'refusal'
            } else {
            
            }

        } else {
            
        }


        user.filse = newFilseFilter
        await user.save()
        await sentToUser.save()
        
        res.send({msg: 'Загрузка отменена'});
    } catch (error) {
        console.log(error);  
        res.send(error);
    }
});





cron.schedule("0 0 * * * *", async () => {
    try {
        const users = await Users.find()

        users.forEach(async (user, index) => {

            const newFilesDelete = [];

            user.filse.forEach(async (file, index) => {

                const expirationTime = new Date(file.expirationTime)
                
                if (expirationTime < new Date()) {

                    const command = new DeleteObjectCommand({
                        Bucket: 'sergay-air-bucket-one',
                        Key: 'files/' + file.filename
                    })

                    await s3Client.send(command)

                    console.log("Файл удалён:", file.filename);
                } else {
                    newFilesDelete.push(file);
                }

            });

            user.filseStorySend.forEach(async (file, index) => {

                const expirationTime = new Date(file.expirationTime)
                
                if (expirationTime < new Date()) {

                    const command = new DeleteObjectCommand({
                        Bucket: 'sergay-air-bucket-one',
                        Key: 'files/' + file.filename
                    })

                    await s3Client.send(command)

                    console.log("Файл удалён:", file.filename);
                }

            });

            user.filseStoryGet.forEach(async (file, index) => {

                const expirationTime = new Date(file.expirationTime)
                
                if (expirationTime < new Date()) {

                    const command = new DeleteObjectCommand({
                        Bucket: 'sergay-air-bucket-one',
                        Key: 'files/' + file.filename
                    })

                    await s3Client.send(command)

                    console.log("Файл удалён:", file.filename);
                }

            });

            user.filse = newFilesDelete
            await user.save();
            
        });

    } catch (error) {
        console.log(error);   
    }
});











module.exports = router;