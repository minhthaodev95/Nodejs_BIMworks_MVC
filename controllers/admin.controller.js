const slugify = require('slugify')
let Post = require('../models/post.model')
let Image = require('../models/image.model')
let Category = require('../models/category.model')
let ParentCategory = require('../models/parent_category.model')
let Author = require('../models/author.model');
const path = require('path');
const multiparty = require('connect-multiparty');
const MultipartyMiddleware = multiparty({ uploadDir: './public/upload' })
const multer =  require('multer');

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





module.exports = {
    index: (req, res, next) => {
        res.render('admin/index_admin', {userAdmin : req.userAdmin});
    },
    posts: async (req, res, next) => {
        const POST_PER_PAGE = 15;
        let page = req.query.page || 1;
    
        // Count total documents
        let totalPage = await Post.countDocuments().then(posts => Math.ceil(posts / POST_PER_PAGE));
    
        // Safety checks on page number
        if(page) {
            parseInt(page);
            if (page < 1) {
                page = 1;
            }
            if (page > totalPage) {
                page = totalPage;
            }
            let skipNumber = POST_PER_PAGE * (page - 1);
    
            // Find documents and add populate values 
            await Post.find({}).sort({createAt: -1}).populate('category').populate('authorID').skip(skipNumber).limit(POST_PER_PAGE)
                .then(posts =>   // Add posts to the response 
                    res.render('admin/posts_admin', {
                        posts: posts, 
                        userAdmin: req.userAdmin, 
                        totalPage: totalPage, 
                        curentPage: page
                    })
                )
                // Error handling 
                .catch(err => {
                    console.log(err);
                    res.status(500).send("Server error")
                });
        }
    },
    
    add_post: async (req, res, next) => {
      let [categories, parentCategories] = await Promise.all([
        Category.find(), 
        ParentCategory.find()
      ]);
    
      res.render('admin/addpost_admin', {
        categories, 
        parentCategories ,
        userAdmin: req.userAdmin
      });
    },
   post_add_post: async (req, res, next) => {
           const POST_TYPE = slugify(req.body.postType);
           const PATH_IMG = req.file ? `${req.protocol}://${req.get('host')}/public/${req.file.path.split('/').slice(1).join('/')}` : '/upload/default_avatar.jpg';
   
           try {
              let featureImage = await Image.create({urlUpload: PATH_IMG});
   
               await Post.create({
                   title: req.body.title,
                   expert: req.body.expert,
                   tags: req.body.tags ? req.body.tags.split(',') : null,
                   authorID: req.body.author,
                   featureImage: featureImage._id,
                   category: req.body.category? req.body.category : null ,
                   url: slugify(req.body.title),
                   type: POST_TYPE,
                   parentCategory: req.body.parentCategory? req.body.parentCategory : null,
                   body: req.body.content
               });
               res.redirect('/admin/add-post');
           } catch(err) {
               console.log(err);
               res.status(500).send("Server Error");
           }
         },
    add_new_category: async (req, res, next) => {
        let categories = await Category.find().then(categories =>   categories);
        let parentCategories = await ParentCategory.find().then(parentCategories =>   parentCategories);
        res.render('admin/add_new_category_admin', { 
            categories: categories, 
            parentCategories: parentCategories, 
            userAdmin: req.userAdmin 
        });
    },
    post_add_new_category: async (req, res, next) => {
      if(req.body.categoryName) {
        const category = await new Category({
          name : req.body.categoryName
        }).save();
      }
    
      if(req.body.parentCategoryName) {
        const parentCategory = await new ParentCategory({
          name : req.body.parentCategoryName
        }).save();
      }
      
      res.redirect('/admin/add-new-category')
    },
    media_library: async (req, res, next) => {
        let images = await Image.find().then(images => images);
        res.render('admin/media_admin', {images :images, userAdmin : req.userAdmin});
    },
    add_new_media: (req, res, next) => {
        res.render('admin/add_media_admin', {userAdmin : req.userAdmin});
    },
    post_add_new_media: async (req, res, next) => {
        try {
            const pathImage = req.file.path.split('/').slice(1).join('/');
            await Image.create({ urlUpload: pathImage });
            res.redirect('/admin/media-library');
        } catch (error) {
            console.log('Error saving media to database: ', error);
            res.status(500).send('Internal Server Error');
        }
    },
    mailbox: (req, res, next) => {
        res.render('admin/mailbox_admin', {userAdmin : req.userAdmin});
    },
    mailbox_compose_admin: (req, res, next) => {
        res.render('admin/mailbox_compose_admin', {userAdmin : req.userAdmin});
    },
    users_admin: (req, res, next) => {
        Author.find()
              .then(users => res.render('admin/users_admin',
                { users: users, userAdmin: req.userAdmin }));
    },
    add_users: (req, res, next) => {
        res.render('admin/add_user', {userAdmin : req.userAdmin});
    },
    post_add_users_admin: (req, res, next) => {
        res.redirect(req.get('referer'));
    },
    logout: (req, res, next) => {
        try {
            res.clearCookie('token');
            res.redirect("/")
          } catch (error) {
              res.status(500).send(error)
          }
    },
    upload: (req, res, next) => {
        console.log('uploading...');
        const tempFile = req.files.upload;
        const tempPathfile = tempFile.path;
        const pathImageArr = tempPathfile.split('/');
        pathImageArr.shift();
        pathImageArr.unshift('');
        const path = pathImageArr.join('/');
    
        const image = new Image({
            urlUpload: path
        });
        image.save();
    
        res.status(200).json({
            uploaded: true,
            url: `${path}`
        });
    },
  delete_post_by_id: async (req, res, next) => {
   await Post.findByIdAndDelete(req.params.id);
    res.redirect(req.get('referer'));

    }

}