const humanFileSize = require('filesize')

class FileData {
    constructor(filename, userId, isPrivate, filesize, accessToken, createdAt, updatedAt, deletedAt, isDeleted) {
        this.filename = filename
        this.userId = userId
        this.isPrivate = isPrivate
        this.filesize = humanFileSize(filesize)
        this.accessToken = accessToken
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.deletedAt = deletedAt
        this.isDeleted = isDeleted
        this.id = `${filename}-${userId}`
    }
}

module.exports = FileData