const Router = require('express')
const router = new Router()
const controller = require('../controller/authController')
const {check} = require('express-validator')

router.post('/registration', [
    check('username', 'username can not be empty').notEmpty(),
    check('password', 'password length must be less 4 symbols').isLength({min:4})
], controller.registration)
router.post('/login',[
    check('username', 'username can not be empty').notEmpty(),
    check('password', 'password length must be less 4 symbols').isLength({min:4})
], controller.login)

module.exports = router