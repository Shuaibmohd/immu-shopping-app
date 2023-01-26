const router = require('express').Router();
const Users = require('../models/Users');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

// Register

router.post("/register", async(req, res) => {

  
    const newUsers = new Users({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SEC_PASS).toString(),
        
    })

    try{
        const savedUsers = await newUsers.save();
        res.status(200).json(savedUsers);
    }catch(err){
        res.status(500).json(err)
        
    }

});


router.post('/login', async(req, res) => {
    try{
        const user = await Users.findOne({username: req.body.username});

        !user && res.status(401).json('wrong credentials!')

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.SEC_PASS);

        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        originalPassword !== req.body.password && res.status(403).json('wrong_credential');

        const accessToken = jwt.sign({
            id:user._id,
            isAdmin:user.isAdmin,
        }, process.env.JWT_SEC, {expiresIn:"3d"})


        const {password, ...others} = user._doc;

        res.status(200).json({...others, accessToken});
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;
