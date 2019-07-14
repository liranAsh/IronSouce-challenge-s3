const router = require('express').Router()

const usersRouter = require('./routes/usersRoutes')
const filesRouter = require('./routes/filesRoutes')

router.use('/users', usersRouter)
router.use('/files', filesRouter)

module.exports = router