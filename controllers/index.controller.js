const Post = require('../models/post.model');
const Category = require('../models/category.model');
const ParentCategory = require('../models/parent_category.model');
const mongoose = require('mongoose');

module.exports = {
    index: async (req, res, next) => {
        let projects = await Post.find({type : "Project"}).sort({createAt : -1}).populate('category').populate('authorID').limit(6)
            .then(projects =>  projects )
        let articles = await Post.find({type : "Article"}).sort({createAt : -1}).populate('authorID').limit(2)
            .then(articles =>  articles )
            //render 
            res.render('index' , 
            {projects : projects, articles : articles})
    },
    about_us: (req, res, next) => {
        res.render('about-us', { title: 'About Us Page' });
    },
    contact_us: (req, res, next) => {
        res.render('contact-us', { title: 'Contact Us Page' });
    },
    price: (req, res, next) => {
        res.render('price', { title: 'Price Page' });
    },
    project_list: async (req, res, next) => {
        const POST_PER_PAGE = 9;
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
    },
    project_list_category: async (req, res, next) => {
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
    },
    project_list_parent_category: async (req, res, next) => {
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
    },
    project_detail: async (req, res, next) => {
        let post = await Post.findOne({url : req.params.url, type : 'Project'}).populate('category').populate('authorID')
        .then(post => post);
      let projects = await Post.aggregate([
        { $match:
            {
          $and: [
              { type: 'Project' },
              { category: new mongoose.Types.ObjectId(post.category.id) }
              ]
            }
        },
        {
          $sample:
            { size: 3 }
        },
        {
          $lookup:
          {
            from: 'categories',
            as: 'category',
            localField: 'category',
            foreignField: '_id'
          }
        }
      ])
        .then(projects => projects)
        res.render('project-detail' , {post : post, projects : projects})
    },
    news_lists: async (req, res, next) => {
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
    },
    news_detail: async (req, res, next) => {
        let post = await Post.findOne({url : req.params.url, type : 'Article'}).populate('authorID')
        .then(post => post)
      let articles = await Post.aggregate([{ $match: { type: 'Article' } }, { $sample: { size: 2 } }, { $lookup: { from: 'authors' ,as : 'authorID', localField: 'authorID', foreignField: '_id'} }])
        .then(articles => articles)
      // console.log(articles[0].authorID[0].name);
      res.render('news-detail', { post: post, articles: articles })
    },
    recruitment: (req, res, next) => {
        res.render('recruitment', {title : 'Recruitment List Page'});
    }

}