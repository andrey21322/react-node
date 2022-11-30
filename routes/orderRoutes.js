const Router = require('express')
const router = new Router()
const controller = require('../controller/orderController')
const {check} = require('express-validator')
const auth = require('../middleware/auth.middleware')

router.get('/', auth, controller.getAll)
router.post('/create', [
    auth,
    check('name', 'name can not be empty').notEmpty(),
], controller.create)
router.delete('/delete/:id', auth, controller.delete)
router.post('/edit/:id', [
    auth,
    check('name', 'name can not be empty').notEmpty(),
], controller.edit)

module.exports = router