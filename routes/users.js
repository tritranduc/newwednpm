var express = require('express');
var router = express.Router();
const shortid = require('shortid');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

// Set some defaults (required if your JSON file is empty)
db.defaults({ posts: [], user: [], count: 0 })
  .write()

// Add a post


var user = db.get('user').value()
var users = db.get('user')


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render("users",{userss: user , valueinput : ""});
});
router.get("/search/", (res,req)=>{
  var q = res.query.q
  var matchedusers = user.filter((user)=>{
    return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1
  });
  req.render("users",{userss:matchedusers,valueinput : q.toLowerCase()})
})
router.get("/create",(req,res)=>{
  res.render("create_user")
})
function check_data (req,res,next){
  var body = req.body
  var name = body.name
  var email = body.email
  var password = body.password
  var phone = body.phone
  var send = {id : shortid.generate() ,name:name , email:email,password:password,phone:phone}
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
  next()
}
router.post("/create",check_data,(req,res)=>{
  var body = req.body
  var name = body.name
  var email = body.email
  var password = body.password
  var phone = body.phone
  var send = {id : shortid.generate() ,name:name , email:email,password:password,phone:phone}
  users.push(send).write()
  console.log(send)
  res.redirect("/users")
})
router.get("/:id",(req,res)=>{
  res.render("showuser",{data : users.find({id:req.params.id}).value()})
})
module.exports = router;
