var express = require('express');
var router = express.Router();
const multer =  require('multer');
var path = require('path')
global.crypto = require('crypto')



let Post = require('../models/post.model')
let Image = require('../models/image.model')
let Category = require('../models/category.model')
let Author = require('../models/author.model');
const { timeEnd } = require('console');

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
  var pathImageArr = req.file.path.split('/');
    pathImageArr.shift();
    pathImageArr.unshift('');
    var pathImage = pathImageArr.join('/');
    const image = new Image({
      urlUpload : pathImage
    });

    console.log(req.body);

  let title = req.body.title || '';
  let content = req.body.title || '';
  let expert = req.body.expert || '';
  let tags = req.body.tags || '';
  let author = req.body.author || '';
  let featureImage = pathImage || '/upload/default_avatar.jpg';
  let category = req.body.category || '';

  const post = new Post({
    title : title,
    expert : expert,
    tags : tags,
    featureImage : featureImage,
    category : category,
    authorID : author,
    body : content,
  });
  post.save();
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
  Author.find()
  .then(users =>   res.render('admin/users_admin' , {users : users}));

});
router.get('/add-users', function(req, res, next) {
    res.render('admin/add_user');
});

module.exports = router;
