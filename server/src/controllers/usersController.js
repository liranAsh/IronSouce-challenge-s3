const { getAllUsers } = require('../logics/usersLogic')

const getAllUsersController = (req, res) => {
    const users = getAllUsers()
    res.send(users)
}

module.exports = {
    getAllUsersController
}