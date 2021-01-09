var express = require('express');
var router = express.Router();

var user = [{id:1 , name : "xi"},{id : 2 , name : "xit"}]

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
module.exports = router;
