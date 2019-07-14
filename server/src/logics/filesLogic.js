const path = require('path')
const fs = require('fs-extra')
const hat = require('hat');
const { uploadedFilesDir } = require('../config')
const FileData = require('../models/fileData')


// This is temp files "db"
const files = {}

// Save file on hard disk
const saveFile = (file, userId) => {
    return new Promise(resolve => {
        const uploadPath = path.join(uploadedFilesDir, userId)
        // Ensure that dir is exists if not it will create the last dir(user id dir)
        fs.ensureDir(uploadPath)

        // Move file from default path(temp dir) to uploaded path
        fs.move(file.path, path.join(uploadPath, file.name), { overwrite: true }, (err) => {
            if (err) {
                console.log(err)
            }
            resolve()
        })
    })
}

const saveFileData = (filename, userId, isPrivate, filesize) => {
    const fileId = convertToFileId(userId, filename)
    const updatedFile = files[fileId]
    const createdDate = updatedFile && updatedFile.createdAt || new Date()
    const updatedDate = new Date()
    const accessToken = isPrivate && generateAccessToken()
    
    const fileData = new FileData(filename, userId, isPrivate, filesize, accessToken, createdDate, updatedDate)
    files[fileData.id] = fileData
    return { ...fileData }
}

const deleteFile = (fileId) => {
    const fileToDelete = files[fileId]
    fileToDelete.isDeleted = true
    fileToDelete.deletedAt = new Date()
}

const toggleFileAccess = (fileId) => {
    let file = files[fileId]
    file.isPrivate = !file.isPrivate
    file.accessToken = file.isPrivate ? (file.accessToken || generateAccessToken()) : file.accessToken
    file.updatedAt = new Date()
}

const getMetadata = (fileId) => {
    const fileData = files[fileId]

    let metadata = {
        filename: fileData.filename,
        filesize: fileData.filesize,
        createdAt: fileData.createdAt,
        updatedAt: fileData.updatedAt,
    }

    if (fileData.isDeleted) {
        metadata.deletedAt = fileData.deletedAt
    }

    return metadata
}

const getAllFiles = () => Object.keys(files).map(key => ({...files[key]}))
const getFileById = (fileId) => ({...files[fileId]})
const isFileExists = (fileId) => files[fileId] && !files[fileId].isDeleted
const getFilePath = (filename, userId) => path.join(uploadedFilesDir, userId, filename)
const generateAccessToken = () => hat()
const convertToFileId = (userId, filename) => `${filename}-${userId}`
const isFilePrivateAndHasPermission = (fileId, accessToken) => {
    const fileData = getFileById(fileId)
    return fileData.isPrivate && fileData.accessToken !== accessToken
}

module.exports = {
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
}