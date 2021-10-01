var express = require('express');
var router = express.Router();
let Author = require('../models/author.model');
const Post = require('../models/post.model');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//  GET auboutus page
router.get('/about-us', function(req, res, next) {
  res.render('about-us', { title: 'About Us Page' });
});
//  GET contact-us page
router.get('/contact-us', function(req, res, next) {
  res.render('contact-us', { title: 'Contact Us Page' });
});
//  GET price page
router.get('/price', function(req, res, next) {
  res.render('price', { title: 'Price Page' });
});

//GET new-lists
router.get('/news-list', function(req, res, next) {
  res.render('news-list', {title : 'News List Page'});
});
//GET new-detail
router.get('/new-detail', function(req, res, next) {
  res.render('news-detail', {title : 'News List detail Page'});
});
//GET projec-list
router.get('/project-list', function(req, res, next) {
  res.render('project-list', {title : 'Project List Page'});
});
//GET projec-list-detail
router.get('/project-detail', function(req, res, next) {
  res.render('project-detail', {title : 'Project Detail Page'});
});
//GET projec-list-detail
router.get('/project/:category/:url', function(req, res, next) {
  Post.findOne({url : req.params.url, type : 'Project'}).populate('category').populate('authorID')
  .then(posts =>   res.render('project-detail' , {posts : posts})
  );
});
router.get('/article/:url', function(req, res, next) {
  Post.findOne({url : req.params.url, type : 'Article'}).populate('authorID')
  .then(posts =>   res.render('news-detail' , {posts : posts})
  );
  
});
//GET recruitment-list
router.get('/recruitment-list', function(req, res, next) {
  res.render('recruitment-list', {title : 'Recruitment List Page'});
});

//GET recruitment-detail
router.get('/recruitment-detail', function(req, res, next) {
  res.render('recruitment-detail', {title : 'Recruitment Detail Page'});
});

// login and register
router.get('/login', function(req, res, next) {
  res.render('admin/login_admin');
});
/* GET Register. */
router.get('/register', function(req, res, next) {
  res.render('admin/register_admin');
});
/* POST Register. */
router.post('/register', function(req, res, next)  {
    let name = req.body.name;
    let age = req.body.age;
    let gender = req.body.gender;
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let address = req.body.address;

    const author =  Author({
      name : name,
      age : parseInt(age),
      gender : gender,
      email :email,
      username : username,
      password : password,
      address : address
    });
     author.save();
    console.log(req.body);
    res.redirect('/register');
  

});





module.exports = router;
