const bcrypt = require('bcrypt');

//function called to hash password
async function hashPassword(password){
    //salt to keep passwords unique
    const salt = await bcrypt.genSalt(10);
    //hashing to hide password
    const hashed = bcrypt.hash(password,salt);
    return hashed;

}

async function isValidPassword(password, hash){
    return await bcrypt.compare(password,hash);
}

module.exports ={hashPassword, isValidPassword};
