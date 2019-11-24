const createUser = function(name, surname, age){
	return {"name":name, "surname":surname, "age":age};
}

const addUser = function(jsonUser, userList){
	userList.push(jsonUser);
}

const sortUser = function(listUser){
	for(var i = 1; i < listUser.length; i++){
		var current = listUser[i];
		var j = i;
		while(j > 0 && (+ listUser[j - 1].age > +current.age)){
			listUser[j] = listUser[j-1];
			j = j-1;
		}
		listUser[j] = current;
    }
	return listUser;
}

const rankUser = function(user, userList){
    var sortedList = sortUser(userList);
    var index = sortedList.findIndex(x => x.name === user.name && x.surname === user.surname && x.age === user.age);
	if(index != -1){
		return userList.length - index
	}
	else{
	return - 1
	}
}

const axios = require('axios');

async function getAllUsers(){
    let res = await axios.get('http://localhost:3000/users');
    return res;
}
module.exports  = {createUser, addUser, sortUser, rankUser, getAllUsers}
