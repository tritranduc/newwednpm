var express = require('express');
var router = express.Router();
const shortid = require('shortid');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

var users= db.get('user')

router.get("/create",(req,res)=>{
    res.render("create_user")
})
function check_data (req,res,next){
    var body = req.body
    var name = body.name
    var email = body.email
    var password = body.password
    var passwordConfirmation = body.passwordConfirmation
    var phone = body.phone
    var id = shortid.generate()
    var send = {id : id ,name:name , email:email,password:password,phone:phone}
    var error = []
    if (!name){
        error.push("name is required")
    }
    if (!email){
        error.push("email is required")
    }
    if (!password){
        error.push("password is required")
    }
    if (!passwordConfirmation){
        error.push("passwordConfirmation is required")
    }
    if (passwordConfirmation!==password){
        error.push("you passwordConfirmation is does required")
    }
    if (!phone){
        error.push("phone is required")
    }
    if (error.length){
        res.render("create_user",{
            errors:error,
            values:send
        })
        return;
    }
    res.locals.send = send
    next()
}
router.post("/create",check_data,(req,res)=>{
    var send = res.locals.send
    users.push(send).write()
    console.log(send)
    res.cookie('userid', send.id,{
        signed:true
    })
    res.redirect("/users")
})

router.get("/login",(req,res, next) => {
    console.log(req.cookies);
    res.render("login")
})
router.post("/login",(req,res,next)=>{
    var email =  req.body.email
    var password = req.body.password
    var user = db.get("user").find({"email":email}).value();
    var error=[]
    console.log(user)
    if (!user){
        error.push("you email is error")
        res.render("login",{
            errors:error,
            values:req.body
        })
        return;
    }
    if(!user.password || password !== user.password){
        error.push("you password is error")
        res.render("login",{
            errors:error,
            values:req.body
        })
        return;
    }
    res.cookie('userid', user.id,{
        signed:true
    })
    res.redirect(301, '/users')
});
router.get("/logout",(req,res)=>{
    res.clearCookie('userid');
    res.redirect(301, '/')
})

module.exports = router;
