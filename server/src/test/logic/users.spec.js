const chai = require('chai')
const usersLogic = require('../../logics/usersLogic')

describe("Users Logic", () => {
    it("it should get all hard coded users", () => {
        const expectedUsers = [
            { name: 'user1', id: 'qAzef32F' },
            { name: 'user2', id: 'hT9Lmdx' }
        ]

        const actualUsers = usersLogic.getAllUsers()

        chai.expect(actualUsers).to.deep.equal(expectedUsers)
    })
})