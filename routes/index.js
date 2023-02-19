var express = require('express');
const router = express.Router();
const indexController = require('../controllers/index.controller')
const authController = require('../controllers/auth.controller');
const contact_formController = require('../controllers/contact_form.controller');

/* GET home page. */
router.get('/', indexController.index);

//  GET auboutus page
router.get('/about-us', indexController.about_us);

//  GET contact-us page
 router.get('/contact-us', indexController.contact_us);
//  GET price page 
router.get('/price', indexController.price);

//GET projec-list 
router.get('/project-list', indexController.project_list);

//GEt project-list-category
router.get('/project-list/:parentCategory/:category', indexController.project_list_category)

//GET project-list-parent category
router.get('/project-list/:parentCategory', indexController.project_list_parent_category)

//GET project-detail 
router.get('/project/:category/:url', indexController.project_detail);

//GET new-lists -->done
router.get('/news-list', indexController.news_lists);

//GET new-detail
router.get('/article/:url', indexController.news_detail);

//GET recruitment (recruitment just have a page )
router.get('/recruitment', indexController.recruitment);

// login and register 
router.get('/login', authController.getLogin);

/* GET Register. */
router.get('/register', authController.getRegister);

//POST login pages 
router.post('/login', authController.postLogin);

/* POST Register. */
// router.post('/register', authController.postRegister);

// POST mail in contact form in page contact-us
router.post(['/contact-us', '/about-us', '/price'], contact_formController.postMail)

// get post by tags
router.get('/tags/:tag', indexController.getPostByTags)

module.exports = router;
