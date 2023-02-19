const Post = require('../models/post.model');
const Category = require('../models/category.model');
const ParentCategory = require('../models/parent_category.model');
const mongoose = require('mongoose');
var createError = require('http-errors');


module.exports = {
    index: async (req, res, next) => {
        let projects = await Post.find({type : "Project"}).sort({createAt : -1}).populate('category').populate('authorID').limit(6);
        let articles = await Post.find({type : "Article"}).sort({createAt : -1}).populate('authorID').limit(2);
    
        // Use async/await
        res.render('index', { projects, articles });
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
    
        let totalPage = Math.ceil(
          await Post.countDocuments({ type: "Project" }) / POST_PER_PAGE
        )
    
        page = page < 1 ? 1 : page
        if (page > totalPage) page = totalPage 
    
        let skipNumber = POST_PER_PAGE * (page - 1);
    
        let projects = await Post.find({type: "Project"})
          .sort({createAt: -1})
          .populate('category')
          .populate('authorID')
          .skip(skipNumber)
          .limit(POST_PER_PAGE)
    
        res.render('project-list', {projects, totalPage, curentPage: page})
    },
    
    project_list_category: async (req, res, next) => {
            let categoryParams = req.params.category
            //Get category id 
            let category = await Category.findOne({ slugName: categoryParams });
            if (category) {
                const POST_PER_PAGE = 9;
                let page = req.query.page ? parseInt(req.query.page) : 1;
    
                if (page < 1) {
                    page = 1;
                }
    
                const totalProjects = await Post.countDocuments({ type: "Project", category: category.id })
                const totalPages = Math.ceil(totalProjects / POST_PER_PAGE);
    
                if (page > totalPages) {
                    page = totalPages;
                }
    
                const skipNumber = POST_PER_PAGE * (page - 1);
    
                if (totalPages > 0) {
                    const projects = await Post.find({type : "Project", category : category.id})
                        .sort({createAt : -1})
                        .populate('category')
                        .populate('authorID')
                        .skip(skipNumber)
                        .limit(POST_PER_PAGE);
    
                    res.render('project-list-category', 
                        { projects: projects, totalPage: totalPages, curentPage: page}
                    );
                } else {
                    res.render('project-list-category', 
                        { projects: [], totalPage: totalPages, curentPage: page}
                    );
                }
                return;            
            } 
            next(createError(404));
        },
    
    project_list_parent_category: async (req, res, next) => {
        let categoryParams = req.params.parentCategory;
        let category = await ParentCategory.findOne({ slugName: categoryParams });
        if (category) {
            const POST_PER_PAGE = 9;
            let page = req.query.page || 1;
            let totalPage = await Post.find({ type: "Project", parentCategory : category.id }).countDocuments().then(posts => Math.ceil(posts / POST_PER_PAGE));
            
            page = parseInt(page);
    
            if (page < 1) {
                page = 1;
            }
            if (page > totalPage) {
                page = totalPage;
            }
            let skipNumber = POST_PER_PAGE * (page - 1);
    
            if (totalPage > 0) {
                await Post.find({type : "Project", parentCategory : category.id})
                    .sort({createAt : -1})
                    .populate('category')
                    .populate('authorID')
                    .skip(skipNumber)
                    .limit(POST_PER_PAGE)
                    .then(projects =>   res.render('project-list-category',
                        { projects : projects, totalPage : totalPage, curentPage : page})
                    )
                    .catch(err => {
                        console.log(err);
                        res.status(500).send("Loi server")
                    });
                return;
            } else {
                res.render('project-list-category',
                    { projects : [], totalPage : totalPage, curentPage : page})
            }
        }
        next(createError(404));
    },
    
    project_detail: async (req, res, next) => {
        // get post data with options to populate category, parentCategory and authorID
        let post = await Post.findOne({ url: req.params.url, type: 'Project' }).populate('category').populate('parentCategory').populate('authorID').then(post => post);
    
        /* use MongoDB`s aggregation pipeline to 
        find posts of type 'Project' in the same category as the current post, 
        take 3 random samples from them and lookup corresponding category data using $lookup*/
        let projects = await Post.aggregate([
            { $match:
                {
                    $and: [
                        { type: 'Project' },
                        { category: new mongoose.Types.ObjectId(post.category.id) }
                    ]
                }
            },
            { $sample: { size: 3 } },
            {
                $lookup: {
                    from: 'categories',
                    as: 'category',
                    localField: 'category',
                    foreignField: '_id'
                }
            }
        ])
        .then(projects => projects);
        
        // render 'project-detail' template with post and projects data
        res.render('project-detail', { post: post, projects: projects });
    },
    news_lists: async (req, res, next) => {
        const POST_PER_PAGE = 6;
    
        let page = parseInt(req.query.page) || 1;
        let totalPage = await Post.find({type : "Article"}).countDocuments().then(posts => Math.ceil(posts / POST_PER_PAGE));
    
        if(page < 1) {
            page = 1;
        }
        if(page > totalPage) {
            page = totalPage;
        }
        let skipNumber = POST_PER_PAGE * (page - 1);
    
        if (totalPage > 0) {
            await Post.find({type : "Article"}).sort({createAt : -1}).populate('authorID').skip(skipNumber).limit(POST_PER_PAGE)
                .then(articles =>   res.render('news-list', 
                    {articles : articles, totalPage : totalPage, curentPage : page})
                )
                .catch(err => {
                    console.log(err);
                    res.status(500).send("Loi server")
                });
            return;
        }
        else {
            res.render('news-list', 
            { articles : [], totalPage : totalPage, curentPage : page})
        }
    },
    news_detail: async (req, res, next) => {
            // Find Post Data with specific url & Type
            let post = await Post.findOne({url : req.params.url, type : 'Article'})
                // Populate authorID with query from authors collection 
                .populate('authorID')
                .then(post => post)
            
            // Aggregate posts of type article in posts collection plus sample 2 for similar articles
            let articles = await Post.aggregate([
                { $match: { type: 'Article' } }, // Match only with article posts
                { $sample: { size: 2 } }, // Sample 2 results
                { 
                    // Do lookup query to authors collection on same requirement fields
                    $lookup: { from: 'authors' ,as : 'authorID', localField: 'authorID', foreignField: '_id'} 
                }
            ])
            .then(articles => articles)
    
            // Render page with found data
            res.render('news-detail', { post: post, articles: articles })
        },
    recruitment: (req, res, next) => {
        res.render('recruitment', {title : 'Recruitment List Page'});
    },
    getPostByTags: async (req, res, next) => {
        let tag = req.params.tag;
        const POST_PER_PAGE = 6;
    
        let page = parseInt(req.query.page) || 1;
        let totalPage = await Post.find({type : "Article", tags : tag}).countDocuments().then(posts => Math.ceil(posts / POST_PER_PAGE));
    
        if(page < 1) {
            page = 1;
        }
        if(page > totalPage) {
            page = totalPage;
        }
        let skipNumber = POST_PER_PAGE * (page - 1);
    
        if (totalPage > 0) {
            await Post.find({type : "Article", tags : tag}).sort({createAt : -1}).populate('authorID').skip(skipNumber).limit(POST_PER_PAGE)
                .then(articles =>   res.render('news-list', 
                    {articles : articles, totalPage : totalPage, curentPage : page})
                )
                .catch(err => {
                    console.log(err);
                    res.status(500).send("Loi server")
                });
            return;
        }
        else {
            res.render('news-list', 
            { articles : [], totalPage : totalPage, curentPage : page})
        }
    },
    
}