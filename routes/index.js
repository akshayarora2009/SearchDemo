var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  request.post('http://localhost:4000/api/jwt/generate', {json: {"user": {"username": "akshay9@outlook.com", "password": "1234"}}},
  function(err, response, body){
    console.log("yes");
    console.log("body: ");
    console.log(body);
    var token = body['token'];
      res.render('index', { title: 'Express', token: token });
  });

});

module.exports = router;
