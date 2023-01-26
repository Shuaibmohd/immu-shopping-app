const router = require("express").Router();
const stripe = require("stripe")("sk_test_51M0jDkSGLmru5JSi7ATYC6pJv4w4Z8amy4VXKpiTgFlsdnivky65wSLXMUEfoPHQ31lS0mNUwzxetrBTgbOSkL5b00RNpkodQJ")

router.post("/payment", (req, res)=> {
    stripe.charges.create(
    {
        source: req.body.tokenId,
        amount:req.body.amount,
        currency:"usd",
    }, 
    (stripeErr, stripeRes)=>{
        if(stripeErr){
            res.status(500).json(stripeErr)
        }else{
            res.status(200).json(stripeRes);
        }
    })
})

module.exports = router;