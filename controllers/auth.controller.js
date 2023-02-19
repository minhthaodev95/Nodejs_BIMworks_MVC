const Author = require('../models/author.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

module.exports = {
   authMiddleware : async (req, res, next) => {
       
       try {
           let token = req.cookies.token; 
           let decodedToken = jwt.verify(token, process.env.SECRET_KEY);
           if (decodedToken) {
               let accountAdmin = await Author.findById(decodedToken._id).then(user => user);
               req.userAdmin = accountAdmin;
               next();
           }
       } catch (err) {
         res.redirect('/');
       }
   },
   
    postLogin: async  (req, res, nested) => {
        let err = [];
    
        // Collect username and password from body of request
        let { username, password } = req.body;
    
        // Check if both credentials provided
        if(!username || !password){
          let msg = !username ? 'Username is not provided' : 'Password is not provided';
          err.push(msg);
        }
    
        // If error we render the respective page with errors's array
        if(err.length != 0) {
          res.render('admin/login_admin', {err: err});
          return;
        }
    
        // Find user based on username with collection Author
        Author.findOne({username: username}).then(user => {
          // If user not found we redirect back to login page
          if(!user) {
            err.push('Username not found');
            res.render('admin/login_admin', {err: err});
            return;
          }
    
          // Compare the Cryptographicaly hashed version of password stored against the one in request
          bcrypt.compare(password, user.password, (errs, result) => {
            
            // If passwords matches we set cookie token with JWT sign and redirect to admin page
            if(result == true) {
              let  token = jwt.sign({ _id:  user._id }, process.env.SECRET_KEY );
          
              res.cookie('token', token);
              res.redirect('/admin')
            }
            // Else wrong credential push the error and redirect back
            else {
              err.push('Password mismatch')
              res.render('admin/login_admin', {err: err});
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