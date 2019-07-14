const hardCodedUsers = [
    { name: 'user1', id: 'qAzef32F' },
    { name: 'user2', id: 'hT9Lmdx' }
]

// Clone array with users
const getAllUsers = () => hardCodedUsers.map(user => ({...user}))

module.exports = {
    getAllUsers
}