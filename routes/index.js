var express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const Author = require('../models/author.model');
const Post = require('../models/post.model');
const Category = require('../models/category.model');
const ParentCategory = require('../models/parent_category.model');

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

//  GET auboutus page --> done
router.get('/about-us', function(req, res, next) {
  res.render('about-us', { title: 'About Us Page' });
});
//  GET contact-us page --> done
 router.get('/contact-us', function(req, res, next) {
  res.render('contact-us', { title: 'Contact Us Page' });
});
//  GET price page  --> done
router.get('/price', function(req, res, next) {
  res.render('price', { title: 'Price Page' });
});

//GET new-lists -->done
router.get('/news-list', async function(req, res, next) {
  const POST_PER_PAGE = 6;
  let page = req.query.page || 1;
  let totalPage = await Post.find({type : "Article"}).countDocuments().then(posts => Math.ceil(posts / POST_PER_PAGE));

  if(page) {
    parseInt(page)
    if(page < 1) {
      page = 1;
    }
    if(page > totalPage) {
      page = totalPage;
    }
    let skipNumber = POST_PER_PAGE * (page - 1);

    await Post.find({type : "Article"}).sort({createAt : -1}).populate('authorID').skip(skipNumber).limit(POST_PER_PAGE)
    .then(articles =>   res.render('news-list', 
    {articles : articles, totalPage : totalPage, curentPage : page})
    )
    .catch(err => {
      console.log(err);
      res.status(500).send("Loi server")
    });
  }
});

//GET projec-list --> done
router.get('/project-list', async function(req, res, next) {
  const POST_PER_PAGE = 2;
  let page = req.query.page || 1;
  let totalPage = await Post.find({ type: "Project" }).countDocuments().then(posts => Math.ceil(posts / POST_PER_PAGE));
  console.log(totalPage);
  if(page) {
    parseInt(page)
    if(page < 1) {
      page = 1;
    }
    if(page > totalPage) {
      page = totalPage;
    }
    let skipNumber = POST_PER_PAGE * (page - 1);

    await Post.find({type : "Project"}).sort({createAt : -1}).populate('category').populate('authorID').skip(skipNumber).limit(POST_PER_PAGE)
    .then(projects =>   res.render('project-list', 
    { projects : projects, totalPage : totalPage, curentPage : page})
    )
    .catch(err => {
      console.log(err);
      res.status(500).send("Loi server")
    });
  }
});

//GEt project-list-category

router.get('/project-list/:parentCategory/:category', async (req, res) => {
  let categoryParams = req.params.category
  //Get category id 
  let category = await Category.findOne({ slugName: categoryParams });
  const POST_PER_PAGE = 9;
  let page = req.query.page || 1;
    let totalPage = await Post.find({ type: "Project", category : category.id }).countDocuments().then(posts => Math.ceil(posts / POST_PER_PAGE));
    if(page) {
      parseInt(page)
      if(page < 1) {
        page = 1;
      }
      if(page > totalPage) {
        page = totalPage;
      }
      let skipNumber = POST_PER_PAGE * (page - 1);
  
      if (totalPage > 0) {
            await Post.find({type : "Project", category : category.id}).sort({createAt : -1}).populate('category').populate('authorID').skip(skipNumber).limit(POST_PER_PAGE)
          .then(projects =>   res.render('project-list-category', 
          { projects : projects, totalPage : totalPage, curentPage : page})
          )
          .catch(err => {
            console.log(err);
            res.status(500).send("Loi server")
          });
        return;
      }
      else {
        res.render('project-list-category', 
        { projects : [], totalPage : totalPage, curentPage : page})
      }
    }
})

//GET project-list-parent category
router.get('/project-list/:parentCategory', async (req, res) => {
  let categoryParams = req.params.parentCategory
  console.log(categoryParams);
  //Get category id 
  let category = await ParentCategory.findOne({ slugName: categoryParams });
  console.log(category);
  const POST_PER_PAGE = 9;
  let page = req.query.page || 1;
    let totalPage = await Post.find({ type: "Project", parentCategory : category.id }).countDocuments().then(posts => Math.ceil(posts / POST_PER_PAGE));
    if(page) {
      parseInt(page)
      if(page < 1) {
        page = 1;
      }
      if(page > totalPage) {
        page = totalPage;
      }
      let skipNumber = POST_PER_PAGE * (page - 1);
  
      if (totalPage > 0) {
            await Post.find({type : "Project", parentCategory : category.id}).sort({createAt : -1}).populate('category').populate('authorID').skip(skipNumber).limit(POST_PER_PAGE)
          .then(projects =>   res.render('project-list-category', 
          { projects : projects, totalPage : totalPage, curentPage : page})
          )
          .catch(err => {
            console.log(err);
            res.status(500).send("Loi server")
          });
        return;
      }
      else {
        res.render('project-list-category', 
        { projects : [], totalPage : totalPage, curentPage : page})
      }
    }
})


//GET projec-list-detail --> done
router.get('/project/:category/:url', function(req, res, next) {
  Post.findOne({url : req.params.url, type : 'Project'}).populate('category').populate('authorID')
  .then(posts =>   res.render('project-detail' , {posts : posts})
  );
});

//GET new-detail --> done
router.get('/article/:url', function(req, res, next) {
  Post.findOne({url : req.params.url, type : 'Article'}).populate('authorID')
  .then(posts =>   res.render('news-detail' , {posts : posts})
  );
});
//GET recruitment (recruitment just have a page )
router.get('/recruitment-list', function(req, res, next) {
  res.render('recruitment-list', {title : 'Recruitment List Page'});
});


// login and register --> done
router.get('/login', function(req, res, next) {
  res.render('admin/login_admin' ,{err : []});
});

//POST login pages -->  done

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
