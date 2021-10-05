const express = require('express');
const router = express.Router();
const multer =  require('multer');
const path = require('path')
global.crypto = require('crypto')
const multiparty = require('connect-multiparty');
const MultipartyMiddleware = multiparty({uploadDir : './public/upload'})
const adminController = require('../controllers/admin.controller')


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
router.get('/', adminController.index);
/* GET posts listing. */
router.get('/posts', adminController.posts);
/* GET add post . */
router.get('/add-post', adminController.add_post);
//GET add new category
router.get('/add-new-category', adminController.add_new_category);
/* GET all media . */
router.get('/media-library', adminController.media_library);
/* GET add-new-media  . */
router.get('/add-new-media',  adminController.add_new_media);
/* GET mailbox  . */
router.get('/mailbox', adminController.mailbox);
//GET mailbox-compose
router.get('/mailbox-compose', adminController.mailbox_compose_admin);
/* GET users  . */
router.get('/users', adminController.users_admin);
// GET add_user
router.get('/add-users', adminController.add_users);
//POST add_user
router.get('/logout', adminController.logout)
//POST add_new_category
router.post('/add-new-category',  adminController.post_add_new_category);
/* POST add-new-media  . */
router.post('/add-new-media',upload.single('newImage'),  adminController.post_add_new_media);
// POST add_post
router.post('/add-post',upload.single('fileInput'), adminController.post_add_post);
//POST image_upload
router.post('/upload', MultipartyMiddleware, adminController.upload);
//POST add_users
router.post('/add-users', adminController.post_add_users_admin);
module.exports = router;
