let usersArray = [];

export const addUser = (userID, userName, roomCode, isAdmin) => {
    const key = roomCode;
    let userNameExists = false;
    const user = {};
    usersArray.forEach(element => {
        const objectRoomCodes = Object.keys(element);
        objectRoomCodes.forEach(code => {
            if (code == roomCode && element[code].userName == userName) {
                userNameExists = true
            } 
        })
    })

    if (userNameExists) {
        return {};
    }
    
    user[key] = {
        userID,
        userName,
        isAdmin
    }
    usersArray.push(user);
    return user;
};

export const checkIfRoomExists = (roomCode) => {
    let result = false;
    usersArray.forEach(element => {
        const objectRoomCodes = Object.keys(element);
        if (objectRoomCodes.includes(roomCode)) {
            result = true;
        }
    });
    return result;
};

export const getUser = (userID) => {
    let user = {};
    usersArray.forEach(element => {
        const objectRoomCodes = Object.keys(element);
        objectRoomCodes.forEach(roomCode => {
            if (element[roomCode].userID == userID) {
                user = {
                    userID: element[roomCode].userID,
                    userName: element[roomCode].userName,
                    isAdmin: element[roomCode].isAdmin,
                    roomCode,
                }

                return user;
            }
        })
    })
    return user;
};

export const deleteUser = (userID) => {
    usersArray.forEach(element => {
        const objectRoomCodes = Object.keys(element);
        objectRoomCodes.forEach(roomCode => {
            if (element[roomCode].userID == userID) {
                let index = usersArray.indexOf(element);
                console.log("deleted user", element[roomCode].userName );
                usersArray.splice(index , 1);
            }
        })
    })  
};

export const getUsers = () => {
    return usersArray;
};

export const getAdmin = (roomCode) => {
    let admin = "";
    usersArray.forEach(element => {
        const objectRoomCode = Object.keys(element);
        if (objectRoomCode == roomCode) {
            const innerObject = element[roomCode];
            if (innerObject.isAdmin == true) {
                admin = innerObject.userID;
            }
        }
    });
    return admin;
};