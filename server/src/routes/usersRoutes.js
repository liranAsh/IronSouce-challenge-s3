const router = require('express').Router()
const { getAllUsersController } = require('../controllers/usersController')

router.get('/all', getAllUsersController)

module.exports = router