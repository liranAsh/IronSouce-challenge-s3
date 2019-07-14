const chai = require('chai')
const chaiHttp = require('chai-http')
chai.should()
const server = require('../../index')
const filesLogic = require('../../logics/filesLogic')

chai.use(chaiHttp);
describe('Files routes', () => {
    describe('Download file', () => {

        // Check if user has permission
        it('it should throw "Forbidden download action for file" error', (done) => {
            const filename = "file.file"
            const userId = "LiranTryFakeUser"
            const isPrivate = true
            const filesize = 30000
            filesLogic.saveFileData(filename, userId, isPrivate, filesize)
        
            const accessToken = "1234567890"

            chai.request(server)
            .get(`/api/files/download?userId=${userId}&filename=${filename}&accessToken=${accessToken}`)
            .end((err, res) => {
                res.should.have.status(403)
                res.error.text.should.to.equal('Forbidden download action for file')
                done()
            })
        })

        // Check if is file exists
        it('it should throw "File not found" error', (done) => {
            const userId = "LiranTryFakeUser"
            const filename = "filenotfound.file"
            const accessToken = null

            chai.request(server)
            .get(`/api/files/download?userId=${userId}&filename=${filename}&accessToken=${accessToken}`)
            .end((err, res) => {
                res.should.have.status(404)
                res.error.text.should.to.equal('File not found')
                done()
            })
        })

        // Check if is metadata requested
        it('it should return metadata for file', (done) => {
            const filename = "file.file"
            const userId = "LiranTryFakeUser"
            const isPrivate = true
            const filesize = 30000
            
            const fileId = filesLogic.convertToFileId(userId, filename)
            filesLogic.saveFileData(filename, userId, isPrivate, filesize)
            const file = filesLogic.getAllFiles().find(file => file.id === fileId)
            const accessToken = file.accessToken

            const expectedMetadata = {
                createdAt: file.createdAt.toISOString(),
                filename: file.filename,
                filesize: file.filesize,
                updatedAt: file.updatedAt.toISOString()
            }

            chai.request(server)
            .get(`/api/files/download?userId=${userId}&filename=${filename}&accessToken=${accessToken}&metadata=${true}`)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.to.deep.equal(expectedMetadata)
                done()
            })
        })

        // Check if is metadata of deleted file requested
        it('it should return metadata for deleted file', (done) => {
            const filename = "file.file"
            const userId = "LiranTryFakeUser"
            const isPrivate = true
            const filesize = 30000
            
            const fileId = filesLogic.convertToFileId(userId, filename)
            filesLogic.saveFileData(filename, userId, isPrivate, filesize)
            filesLogic.deleteFile(fileId)
            const file = filesLogic.getAllFiles().find(file => file.id === fileId)
            const accessToken = file.accessToken

            const expectedMetadata = {
                createdAt: file.createdAt.toISOString(),
                filename: file.filename,
                filesize: file.filesize,
                updatedAt: file.updatedAt.toISOString(),
                deletedAt: file.deletedAt.toISOString()
            }

            chai.request(server)
            .get(`/api/files/download?userId=${userId}&filename=${filename}&accessToken=${accessToken}&metadata=${true}`)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.to.deep.equal(expectedMetadata)
                done()
            })
        })
    })

    describe('Update file access', () => {
        // Check if user has permission
        it('it should throw "Forbidden change access action" error', (done) => {
            const filename = "file.file"
            const userId = "LiranTryFakeUser"
            const reqUserId = "LiranTryFakeUser" // Someone fake it but accesstoken should protect this
            const isPrivate = true
            const filesize = 30000
            filesLogic.saveFileData(filename, userId, isPrivate, filesize)
        
            const accessToken = "1234567890"

            chai.request(server)
            .put(`/api/files/toggleAccess`)
            .send({reqUserId, userId, filename, accessToken})
            .end((err, res) => {
                res.should.have.status(403)
                res.error.text.should.to.equal('Forbidden change access action')
                done()
            })
        })

        // Check if is file exists
        it('it should throw "File not found" error', (done) => {
            const userId = "LiranTryFakeUser"
            const reqUserId = "LiranTryFakeUser"
            const filename = "filenotfound.file"
            const accessToken = null

            chai.request(server)
            .put(`/api/files/toggleAccess`)
            .send({reqUserId, userId, filename, accessToken})
            .end((err, res) => {
                res.should.have.status(404)
                res.error.text.should.to.equal('File not found')
                done()
            })
        })
    })

    describe('Delete file access', () => {
        // Check if user has permission
        it('it should throw "Forbidden delete action" error', (done) => {
            const filename = "file.file"
            const userId = "LiranTryFakeUser"
            const reqUserId = "LiranTryFakeUser" // Someone fake it but accesstoken should protect this
            const isPrivate = true
            const filesize = 30000
            filesLogic.saveFileData(filename, userId, isPrivate, filesize)
        
            const accessToken = "1234567890"

            chai.request(server)
            .delete(`/api/files/delete`)
            .send({reqUserId, userId, filename, accessToken})
            .end((err, res) => {
                res.should.have.status(403)
                res.error.text.should.to.equal('Forbidden delete action')
                done()
            })
        })

        // Check if is file exists
        it('it should throw "File not found" error', (done) => {
            const userId = "LiranTryFakeUser"
            const reqUserId = "LiranTryFakeUser"
            const filename = "filenotfound.file"
            const accessToken = null

            chai.request(server)
            .delete(`/api/files/delete`)
            .send({reqUserId, userId, filename, accessToken})
            .end((err, res) => {
                res.should.have.status(404)
                res.error.text.should.to.equal('File not found')
                done()
            })
        })

        // Check if is file deleted
        it('it should throw "File not found" error', (done) => {
            const filename = "file.file"
            const userId = "LiranTryFakeUser"
            const reqUserId = "LiranTryFakeUser"
            const isPrivate = true
            const filesize = 30000
            
            const fileId = filesLogic.convertToFileId(userId, filename)
            filesLogic.saveFileData(filename, userId, isPrivate, filesize)
            filesLogic.deleteFile(fileId)
            const file = filesLogic.getAllFiles().find(file => file.id === fileId)
            const accessToken = file.accessToken

            chai.request(server)
            .delete(`/api/files/delete`)
            .send({reqUserId, userId, filename, accessToken})
            .end((err, res) => {
                res.should.have.status(404)
                res.error.text.should.to.equal('File not found')
                done()
            })
        })
    })
    
})