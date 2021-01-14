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
var users= db.get('user')


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

router.get("/:id",(req,res)=>{
  res.render("showuser",{data : users.find({id:req.params.id}).value()})
})
module.exports = router;
