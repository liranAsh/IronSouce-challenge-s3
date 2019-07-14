const router = require('express').Router()
const formidableMiddleware = require('express-formidable');

const { 
    getAllFilesController, 
    downloadFileController,
    uploadFileController,
    updateFileAccessController,
    deleteFileController,
} = require('../controllers/filesController')

router.get('/all', getAllFilesController)
router.get('/download', downloadFileController)
router.post('/upload', formidableMiddleware(), uploadFileController)
router.put('/toggleAccess', updateFileAccessController)
router.delete('/delete', deleteFileController)

module.exports = router