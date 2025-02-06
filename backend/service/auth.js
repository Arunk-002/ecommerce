const jwt = require('jsonwebtoken')
const key = process.env.KEY


function createToken(payload) {
    return jwt.sign(payload,key,{expiresIn:'24hr'})
}

function verifyToken(token) {
    return jwt.verify(token,key)
}

module.exports={
    createToken,
    verifyToken
}