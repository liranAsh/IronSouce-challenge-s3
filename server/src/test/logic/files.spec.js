const chai = require('chai')
const sinon = require('sinon')
const filesLogic = require('../../logics/filesLogic')
/**
 * I don't find a way to test "files" object because we not realy save it
 * into a file or db. -- Needs refactor
 * "files" object, can't change in reference because 'require' function create "files" object in a new scope.
 * Sorry, but I'm running out of time and can't refactoring now..
 */
describe("Files Logic", () => {

    const filename = "someFilename.som"
    const userId = "userId-123"
    const isPrivate = false
    const filesize = 30000
    const fileId = filesLogic.convertToFileId(userId, filename)

    beforeEach(() => {

        filesLogic.saveFileData(filename, userId, isPrivate, filesize)
    })

    it('it should create new file data', () => {
        const filename = "someFilename2.som"
        const userId = "userId-123"
        const isPrivate = false
        const filesize = 30000
        const fileId = filesLogic.convertToFileId(userId, filename)
        
        filesLogic.saveFileData(filename, userId, isPrivate, filesize)
        const newFileData = filesLogic.getAllFiles().find(file => file.id === fileId)

        const expectedNewFile = {
            accessToken:false,
            createdAt: new Date(newFileData.createdAt),
            deletedAt:undefined,
            filename,
            filesize:"29.3 KB",
            id:"someFilename2.som-userId-123",
            isDeleted:undefined,
            isPrivate:false,
            updatedAt: new Date(newFileData.createdAt),
            userId
        }

        chai.expect(newFileData).to.deep.equal(expectedNewFile)
    })

    it('it should update file access', () => {

        filesLogic.toggleFileAccess(fileId)
        const updatedFile = filesLogic.getAllFiles().find(file => file.id === fileId)

        chai.expect(updatedFile.isPrivate).to.equal(true)
    })

    it('it should delete file', () => {
        filesLogic.deleteFile(fileId)
        const deletedFile = filesLogic.getAllFiles().find(file => file.id === fileId)

        chai.expect(deletedFile.isDeleted).to.equal(true)
    })

    it('it should get meatadata of exist file', () => {
        const file = filesLogic.getAllFiles().find(file => file.id === fileId)
        const meatadata = filesLogic.getMetadata(fileId)

        const expectedMetadata = {
            createdAt: new Date(file.createdAt),
            filename: file.filename,
            filesize: file.filesize,
            updatedAt: new Date(file.updatedAt)
        }

        chai.expect(meatadata).to.deep.equal(expectedMetadata)
    })

    it('it should get meatadata of deleted file', () => {
        filesLogic.deleteFile(fileId)
        const file = filesLogic.getAllFiles().find(file => file.id === fileId)
        const meatadata = filesLogic.getMetadata(fileId)

        const expectedMetadata = {
            createdAt: new Date(file.createdAt),
            filename: file.filename,
            filesize: file.filesize,
            updatedAt: new Date(file.updatedAt),
            deletedAt: new Date(file.deletedAt)
        }

        chai.expect(meatadata).to.deep.equal(expectedMetadata)
    })

    it("it should concat name and userId for create file id", () => {
        const filename = "someFilename.som"
        const userId = "userId-123"
        const expectedFileId = "someFilename.som-userId-123"
        const actualFileId = filesLogic.convertToFileId(userId, filename)
        chai.expect(actualFileId).to.equal(expectedFileId)
    })
})