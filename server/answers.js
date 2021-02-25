let answersArray = [];

export const addUser = (userName, answer) => {
    if (usersArray.includes(userName)) {
        return {};
    }
    const answer = {
        userName,
        answer,
    }
    answersArray.push(answer);
};

export const getUser = (userName) => {
    return usersArray.find(user => user.userName == userName);
};

export const deleteUser = (userName) => {
    usersArray.splice(usersArray.find(user => user.userName == userName), 1);
    
};

export const getAnswers = () => {
    return answersArray;
};
  