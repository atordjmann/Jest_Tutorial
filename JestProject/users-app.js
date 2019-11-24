const {getAllUsers} = require('./user');
async function showData() {
    let res = await getAllUsers();
    console.log(res.data);
}

showData();
console.log('finished')