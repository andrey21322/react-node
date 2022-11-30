const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const {secret} = require('../config')

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message: 'Username can not be empty and password can not be less then 4 symbols'})
            }

            const {username, password} = req.body
            const candidate = await User.findOne({username})
            if (candidate) {
                return res.status(400).json({message: 'User with this username already exist'})
            }
            
            const hashPassword = bcrypt.hashSync(password, 7);
            const user = new User({ username, password: hashPassword })

            await user.save()
            res.status(201).json({message: 'User created'})
        } catch(e) {
            console.log(e)
            res.status(400).json({message: 'Registration error'})   
        }
    }
    
    async login(req, res) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message:'Login error'})
            }

            const {username, password} = req.body
            const user = await User.findOne({username})

            if(!user) {
                return res.status(400).json({message: `No user ${username}`})
            }

            const validPassword = bcrypt.compareSync(password, user.password)
            
            if(!validPassword) {
                return res.status(400).json({message: `Uncorrect password`})
            }
            
            const token = jwt.sign(
                { userId: user.id },
                secret, 
                {expiresIn: '24h'}
            ) 
            return res.json({token, userId: user.id})   
        } catch(e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})   
        }
    }
}

module.exports = new authController()