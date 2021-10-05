const Author = require('../models/author.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

module.exports = {
    authMiddleware :  async (req, res, next) => {
    
        try {
            let token = req.cookies.token;
            let hasToken = jwt.verify(token, process.env.SECRET_KEY)
            if (hasToken) {
                let accountAdmin = await Author.findById(hasToken._id).then(user => user);
                req.userAdmin = accountAdmin;
                next();
            }
        } catch (error) {
            res.redirect('/')
        }
    },
    postLogin: async  (req, res, nested) => {
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
              let  token = jwt.sign({ _id:  user._id }, process.env.SECRET_KEY );
          
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
        
    },
    getLogin: (req, res, next) => {
        res.render('admin/login_admin' ,{err : []});
    },
    postRegister: (req, res, next) => {
       // console.log(req.body);
        //   let name = req.body.name;
        //   let age = req.body.age;
        //   let gender = req.body.gender;
        //   let email = req.body.email;
        //   let username = req.body.username;
        //   let address = req.body.address;
        //   bcrypt.hash(req.body.password, saltRounds, function(err,hash) {
        //     password  = hash; 
        //     const author =  Author({
        //       name : name,
        //       age : parseInt(age),
        //       gender : gender,
        //       email :email,
        //       username : username,
        //       password : password,
        //       address : address
        //     });
        //     console.log(author)
        //      author.save();
        //   })
        //     res.redirect('/login');
    },
    getRegister: (req, res, next) => {
        res.render('admin/register_admin');
    }


}