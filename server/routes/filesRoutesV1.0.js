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
const multerS3 = require('multer-s3')

const Users = require('../moduls/users')

const authMidelwares = require('../midelwares/authMidelwares')
const multer = require('multer');
const users = require('../moduls/users');





// const s3Client = new S3Client({
//     region: 
//     credentials: {
//       accessKeyId: 
//       secretAccessKey: 
//     }
// })

// const getFileList = async () => {
//   const command = new ListObjectsV2Command({
//     Bucket: 'sergay-air-bucket-one',
//     key: '/'
//   })

//   console.log(command);

//   const result = await s3Client.send(command)
//   console.log(result);

// }

// async function init() {
//   await getFileList()
// }

// init()






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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const pathFiles = path.join(__dirname, '../files')
        console.log(pathFiles);
        cb(null, pathFiles)
    },
    filename: function (req, file, cb) {
        cb(null, generateFilename(file.originalname))
    }
    
})


const upload = multer({
    storage: storage,
    limits: { 
        fileSize: 1024 * 1024 * 100000
    }
})




const uploadS3 = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'sergay-air-bucket-one',

    key: function (req, file, cb) {
      cb(null, 'files/' + generateFilename(file.originalname));
      console.log('key');
      console.log(file);
    },

  })
})





router.post('/fileLoad/:id/', upload.array('files'), authMidelwares, async (req, res) => {
    try {

        const userId = req.userId
    
        const { id } = req.params
        const { data, device, username } = req.headers

        // console.log(id);  
        // console.log(device);  
        // console.log(data);  
        // console.log(username);

        console.log('========== files ==========');
        console.log(req.files);

        const user = await Users.findOne({shareId: id})
        const sentToUsername = await Users.findOne({_id: userId})

        req.files.forEach((item, index) => {

            const obj = {
                id: Math.floor(Math.random() * 9999999999),
                filename: item.filename,
                sentFromDevice: device,
                data: data,
                sentToUser: username,
                userWillReceive: user.username
            }

            console.log(obj);

            user.filse.push(obj)
            sentToUsername.filseStorySend.push(obj)
        })

        console.log(user);
        await user.save()
        await sentToUsername.save()


        res.status(200).send({msg:'Файлы успешно загружены!'});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error.message})
    }
});





router.post('/fileLoadNew/:id/', uploadS3.array('files'), authMidelwares, async (req, res) => {
    try {

        const userId = req.userId
    
        const { id } = req.params
        const { data, device, username } = req.body

        console.log(id);  
        console.log(device);  
        console.log(data);  
        console.log(username);

        console.log(req.files);

        const user = await Users.findOne({shareId: id})
        const sentToUsername = await Users.findOne({_id: userId})

        req.files.forEach((item, index) => {

            const obj = {
                id: Math.floor(Math.random() * 9999999999),
                filename: item.filename,
                sentFromDevice: device,
                data: data,
                sentToUser: username,
                userWillReceive: user.username
            }

            console.log(obj);

            user.filse.push(obj)
            sentToUsername.filseStorySend.push(obj)
        })

        console.log(user);
        await user.save()
        await sentToUsername.save()


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
        const { textValue, data, device, username } = req.body
        const userId = req.userId

        const user = await Users.findOne({shareId: id})
        const sentToUsername = await Users.findOne({_id: userId})

        const obj = {
            id: Math.floor(Math.random() * 9999999999),
            text: textValue,
            sentFromDevice: device,
            data: data,
            sentToUser: username,
            userWillReceive: user.username
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







router.get('/getDownload/:option/:shareId/:fileId', async (req, res) => {
    try {
        console.log(req.params);
        
        const { shareId, fileId, option } = req.params
    
        const userShareId = await Users.findOne({shareId: shareId})
        const filse = userShareId.filse

        const getFile = filse.find((item) => item.id == fileId)
        const deleteFile = filse.filter((item) => item.id != fileId)
        
        console.log("filse: " + JSON.stringify(filse));

        console.log("====================================================\n\n");
        console.log("findFile (getFile)");
        console.log(getFile);
        console.log("====================================================");
        console.log("deleteFile");
        console.log(deleteFile);
        console.log("====================================================\n\n");
        
        if (option == 'file') {
            if (getFile != undefined) {
                userShareId.filseStoryGet.unshift(getFile)
                userShareId.filse = deleteFile
                await userShareId.save()

                const pathFiles = path.join(__dirname, '../files', getFile.filename)

                res.sendFile(pathFiles);
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
        user.filse = []
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
        const newFilse = user.filse.filter((item) => item.id != id)
        user.filse = newFilse
        await user.save()
        
        res.send({msg: 'Загрузка отменена'});
    } catch (error) {
        console.log(error);  
        res.send(error);
    }
});


module.exports = router;