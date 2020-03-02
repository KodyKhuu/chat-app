const users = []

const addUser = ({ id, username, room }) => {
    // CLean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are requried!'
        }
    }
    
    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // validate username
    if (existingUser) {
        return{
            error: 'Username is in use!'
        }
    }

    //Store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if (index !== -1) {
        return users.splice(index, 1)[0]
    } 
}

const getUser = (id) => {
    // const user = users.find((user) => {
    //     return user.id === id
    // })

    // return user
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    // const usersInRoom = users.filter((user) => {
    //     return user.room === room
    // })

    // return usersInRoom
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}


