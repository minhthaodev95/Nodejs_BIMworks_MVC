var express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const Author = require('../models/author.model');
const Post = require('../models/post.model');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let projects = await Post.find({type : "Project"}).sort({createAt : -1}).populate('category').populate('authorID').limit(6)
    .then(projects =>  projects )
  let articles = await Post.find({type : "Article"}).sort({createAt : -1}).populate('authorID').limit(2)
    .then(articles =>  articles )
    //render 
    res.render('index' , 
    {projects : projects, articles : articles})
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
router.get('/news-list', async function(req, res, next) {
  let articles = await Post.find({type : "Article"}).sort({createAt : -1}).populate('authorID')
    .then(articles =>  articles )
  res.render('news-list', {articles :articles});
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
  res.render('admin/login_admin' ,{err : []});
});

//POST login pages

router.post('/login', function(req, res, next) {
  let err = [];
  let username = req.body.username;
  let password = req.body.password;
  if(!username) {
    err.push('Username is not provided')
  }
   if(!password) {
    err.push('Password is not provided')
  }
  if(err.length) {
    res.render('admin/login_admin' ,{err : err});
    return;
  }
  Author.findOne({username: username}).then(user => {
    if(!user) {
      err.push('Username not found');
      res.render('admin/login_admin' ,{err : err});
      return;
    }
    
    bcrypt.compare(password, user.password, (errs, result) => {
      if(result == true) {
        let  token = jwt.sign({ _id:  user._id }, 'secretString');
    
        res.cookie('token', token);
        res.redirect('/admin')
      }
      else {
        err.push('Password mismatch')
        res.render('admin/login_admin' ,{err : err});
        return;
      }
    })
    
    

  })
  


})

/* GET Register. */
router.get('/register', function(req, res, next) {
  res.render('admin/register_admin');
});
/* POST Register. */
router.post('/register', function(req, res, next)  {
  console.log(req.body);
  let name = req.body.name;
  let age = req.body.age;
  let gender = req.body.gender;
  let email = req.body.email;
  let username = req.body.username;
  let address = req.body.address;
  bcrypt.hash(req.body.password, saltRounds, function(err,hash) {
    password  = hash; 
    const author =  Author({
      name : name,
      age : parseInt(age),
      gender : gender,
      email :email,
      username : username,
      password : password,
      address : address
    });
    console.log(author)
     author.save();
  })
    res.redirect('/register');
});





module.exports = router;
