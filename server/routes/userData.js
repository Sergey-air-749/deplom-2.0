const express = require('express')  
const router = express.Router()
require('dotenv').config();
const path = require('path');

const Users = require('../moduls/users')

const authMidelwares = require('../midelwares/authMidelwares')




router.get('/getUserData', authMidelwares, async (req, res, next) => {
    const userId = req.userId

    try {
        const user = await Users.findOne({_id: userId})

        if (user != null) {
            console.log(user);
            user.password = undefined
            res.json(user)
        } else {
            res.status(500).json({msg: 'invalid data'})
        }

    } catch (error) {
        res.status(500).json({msg: error.message})
    }
});


router.get('/images/avatars/:id', async (req, res, next) => {
    const { id } = req.params

    try {
        const usersAvatars = path.join(__dirname, '../avatars', `${id}.png`)
        console.log(usersAvatars);
        res.sendFile(usersAvatars)
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
});


module.exports = router;