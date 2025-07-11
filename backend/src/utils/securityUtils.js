const bcrypt =require("bcrypt")

const saltRounds=parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);

async function hashPassword(password) {
    return await bcrypt.hash(password, saltRounds);
}

async function comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

module.exports={hashPassword,comparePassword}