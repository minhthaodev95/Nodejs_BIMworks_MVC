var express = require('express');
var router = express.Router();
const multer =  require('multer');
var path = require('path')
global.crypto = require('crypto')
var slugify = require('slugify')



let Post = require('../models/post.model')
let Image = require('../models/image.model')
let Category = require('../models/category.model')
let ParentCategory = require('../models/parent_category.model')

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
router.get('/add-post', async function(req, res, next) {
  let categories = await Category.find().then(categories =>   categories);
  let parentCategories = await ParentCategory.find().then(parentCategories =>   parentCategories);
  res.render('admin/addpost_admin' , {categories : categories, parentCategories : parentCategories}
  );
});

//GET add new category
router.get('/add-new-category', async (req, res, next) => {
  let categories = await Category.find().then(categories =>   categories);
  let parentCategories = await ParentCategory.find().then(parentCategories =>   parentCategories);
  res.render('admin/add_new_category_admin' , {categories : categories, parentCategories : parentCategories}
  );
})
router.post('/add-new-category',  (req, res, next) => {
  if(req.body.categoryName) {
    let category = new Category({
      name : req.body.categoryName
    });
    category.save();
    res.redirect('/admin/add-new-category')
  }
  if(req.body.parentCategoryName) {
    let parentCategory = new ParentCategory({
      name : req.body.parentCategoryName
    });
    parentCategory.save();
    res.redirect('/admin/add-new-category')
  }
  res.redirect('/admin/add-new-category')

})

// POST add post

router.post('/add-post',upload.single('fileInput'), function(req, res, next) {
  var pathImageArr = req.file.path.split('/');
    pathImageArr.shift();
    pathImageArr.unshift('');
    var pathImage = pathImageArr.join('/');
    const image = new Image({
      urlUpload : pathImage
    });
    image.save();

  let title = req.body.title || '';
  let content = req.body.content || '';
  let expert = req.body.expert || '';
  let tags = req.body.tags || '';
  let author = req.body.author || '';
  let featureImage = pathImage || '/upload/default_avatar.jpg';
  let category = req.body.category || '';
  let url = slugify(req.body.title);
  let  postType= slugify(req.body.postType);
  let parentCategory = slugify(req.body.parentCategory);
  console.log(url)
  const post = new Post({
    title : title,
    expert : expert,
    tags : tags,
    featureImage : featureImage,
    category : category,
    authorID : author,
    body : content,
    url : url,
    type : postType,
    parentCategory : parentCategory
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
