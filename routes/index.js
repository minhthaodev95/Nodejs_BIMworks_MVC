var express = require('express');
var router = express.Router();

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
//GET recruitment-list
router.get('/recruitment-list', function(req, res, next) {
  res.render('recruitment-list', {title : 'Recruitment List Page'});
});

//GET recruitment-detail
router.get('/recruitment-detail', function(req, res, next) {
  res.render('recruitment-detail', {title : 'Recruitment Detail Page'});
});







module.exports = router;
