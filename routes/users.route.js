var express = require('express');
var router = express.Router();
const multer =  require('multer');
var path = require('path')
global.crypto = require('crypto')



let Post = require('../models/post.model')
let Category = require('../models/category.model')

//folder upload image
var storage = multer.diskStorage({
  destination: './public/upload/',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
})
const upload = multer({ storage: storage })


/* GET admin dashboard. */
router.get('/', function(req, res, next) {
  res.render('admin/index_admin');
});
/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('admin/login_admin');
});
/* GET posts listing. */
router.get('/posts', function(req, res, next) {
  Post.find().populate('category').populate('authorID')
  .then(posts =>   res.render('admin/posts_admin' , {posts : posts})
  );
});
/* GET add post . */
router.get('/add-post', function(req, res, next) {
  Category.find().then(categories =>   res.render('admin/addpost_admin' , {categories : categories})
  );
});
// POST add post

router.post('/add-post',upload.single('fileInput'), function(req, res, next) {
  console.log(req.file);
  console.log(req.body);
  res.redirect('/admin/add-post');  
})


/* GET all media . */
router.get('/media-library', function(req, res, next) {
  res.render('admin/media_admin');
});
/* GET mailbox  . */

router.get('/mailbox', function(req, res, next) {
  res.render('admin/mailbox_admin');
});
router.get('/mailbox-compose', function(req, res, next) {
  res.render('admin/mailbox_compose_admin');
});
/* GET users  . */

router.get('/users', function(req, res, next) {
  res.render('admin/users_admin');
});

module.exports = router;
