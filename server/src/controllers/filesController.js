const {
    saveFile,
    saveFileData,
    toggleFileAccess,
    deleteFile,
    getMetadata,
    getAllFiles,
    getFileById,
    getFilePath,
    isFilePrivateAndHasPermission,
    isFileExists,
    convertToFileId
} = require('../logics/filesLogic')

const getAllFilesController = (req, res) => {
    const allFilesList = getAllFiles()
    res.send(allFilesList)
}

const uploadFileController = async (req, res) => {
    const { file } = req.files
    const { userId } = req.fields
    // Parse string to boolean
    const isPrivate = req.fields.isPrivate === 'true'

    await saveFile(file, userId)
    
    const fileData = saveFileData(file.name, userId, isPrivate, file.size)
    res.status(201).send(fileData)
}

const downloadFileController = (req, res) => {
    const { userId, metadata, filename, accessToken } = req.query
    const fileId = convertToFileId(userId, filename)

    // Check if user has permission
    if (isFilePrivateAndHasPermission(fileId, accessToken)) {
        res.status(403).send('Forbidden download action for file')
        return;
    }
    // Check if is metadata requested
    if (metadata) {
        const fileMetadata = getMetadata(fileId)
        res.send(fileMetadata)
        return;
    }
    // Check if is file exists
    if (!isFileExists(fileId)) {
        res.status(404).send('File not found')
        return;
    }

    res.download(getFilePath(filename, userId))
}

const updateFileAccessController = (req, res) => {
    const { reqUserId, userId, filename, accessToken } = req.body
    const fileId = convertToFileId(userId, filename)

    // Check if is file exists
    if (!isFileExists(fileId)) {
        res.status(404).send('File not found')
        return;
    }
    // Check if user has permission
    if (reqUserId !== userId || isFilePrivateAndHasPermission(fileId, accessToken)) {
        res.status(403).send('Forbidden change access action')
        return;
    }

    toggleFileAccess(fileId)
    res.send(getFileById(fileId))
}

const deleteFileController = (req, res) => {
    const { reqUserId, userId, filename, accessToken } = req.body
    const fileId = convertToFileId(userId, filename)

    // Check is file exists
    if (!isFileExists(fileId)) {
        res.status(404).send('File not found')
        return;
    }
    // Check file permission
    if (reqUserId !== userId || isFilePrivateAndHasPermission(fileId, accessToken)) {
        res.status(403).send('Forbidden delete action')
        return;
    }

    deleteFile(fileId)
    res.send(getFileById(fileId))
}

module.exports = {
    getAllFilesController,
    downloadFileController,
    uploadFileController,
    updateFileAccessController,
    deleteFileController,
}