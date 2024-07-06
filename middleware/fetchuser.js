var jwt  = require('jsonwebtoken');

var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

const JWT_SECRET = process.env.JWT_SECRET;

const fetchuser = (req, res, next) => {

    // get user from jwt token and add id to req object
    const token = localStorage.getItem('token');

    if(!token)
    {
        return res.status(401).send({error: "Please authenticate using a valid token"});
    }

    try{
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;

        next();

    }
    catch(error){
        res.status(401).send({error: "Please Authenticate using a valid token"});
    }
}

module.exports = fetchuser;