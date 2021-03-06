let express = require('express');
let router = express.Router();
let userOperations = require(__BASE__+"modules/database/accessors/user_operations");
let profileOperations = require(__BASE__+"modules/database/accessors/profile_operations");
let path = require('path');
let cookieParser = require('cookie-parser');
let RESPONSE = require(__BASE__ + "modules/controller/handler/ResponseHandler");
let DataValidator = require(__BASE__ + "modules/utils/DataValidator");
let client = require(__BASE__ + "modules/controller/handler/TokenHandler").REDIS_CLIENT;
let UserController = require(__BASE__ + "modules/controller/UserController");
let ProfileController = require(__BASE__ + "modules/controller/ProfileController");
let TokenHandler = require(__BASE__ + "modules/controller/handler/TokenHandler");
const nodemailer = require('nodemailer');
let customUUID = require(__BASE__ + "modules/utils/CustomUUID");
let notificationOperations = require(__BASE__+"modules/database/accessors/notification_operations");
const bcrypt = require('bcrypt');

/* GET users listing. */
router.post('/login', function(req, res) {

    let userPass = req.body.password;
    let userPhone = req.body.phone;

    //
    // if (!DataValidator.isValidPassword(userPass)){
    //
    //     console.log("User input is not correct");
    //     RESPONSE.sendError(res,{success:false});
    //
    // }else {
        let parameters = {
            userpass: userPass,
            phone: userPhone
        };

        UserController.getUsers(parameters)
            .then(function (data) {
                if (data) {
                    console.log("dd");
                    RESPONSE.sendOkay(res, {success:true,data:data[0]});
                } else {


                    console.log("sfsfsfsafasfsfsfsf");

                    RESPONSE.sendOkay(res,{success:false,data:'Cant find user with the given credentials'});
                }
            }).catch(function (err) {
            console.log(err);
        });
    // }


});
router.post('/getUserByPinCode', function(req, res) {
            let parameters = {
            pincode: req.body.pincode,
        };

        UserController.getUserFullDetail(parameters)
            .then(function (data) {
                if (data) {
                    RESPONSE.sendOkay(res, data);
                } else {
                    RESPONSE.sendOkay(res,{success:false,data:'Cant find user with the given credentials'});
                }
            }).catch(function (err) {
            console.log(err);
        });
});
router.post('/getSellerByPinCode', function(req, res) {
    let parameters = {
        pincode: req.body.pincode,
        role:'Seller'
    };

    UserController.getUserFullDetail(parameters)
        .then(function (data) {
            if (data) {
                RESPONSE.sendOkay(res, data);
            } else {
                RESPONSE.sendError(res,{success:false,data:'Cant find user with the given credentials'});

                console.log("Some error occured while getting data from the database");
            }
        }).catch(function (err) {
        console.log(err);
    });
});

router.post('/getUserById', function(req, res) {

    let id = req.body._id;

    let parameters = {
        _id: id,
    };

    UserController.getUserFullDetail(parameters)
        .then(function (data) {
            if (data.length >0) {

                /*Setting up session parameters*/
                // req.session.key = TokenHandler.generateAuthToken(data[0]._id,data[0].role);
                // req.session.email=data[0].email;
                // req.session.role = data[0].role;

                console.log(data[0]);
                RESPONSE.sendOkay(res, data[0]);
            } else {
                RESPONSE.sendError(res,{success:false,data:'Cant find user with the given credentials'});

                console.log("Some error occured while getting data from the database");
            }
        }).catch(function (err) {
        console.log(err);
    });
});




router.post('/register',function(req,res) {
    let parameters = {
        email: req.body.email,
        password: req.body.password,
        firstname: req.body.firstname,
        phone:req.body.phone,
        role:req.body.role,
        credit:'0'
    };
    if(req.body.gender){
        parameters.gender = req.body.gender;
    }
    if(req.body.flataddress){
        parameters.flataddress = req.body.flataddress;
    }
    if(req.body.secondary_phoneno){
        parameters.secondary_phoneno = req.body.secondary_phoneno;
    }
    if(req.body.latitude){
        parameters.latitude = req.body.latitude;
    }
    if(req.body.longitude){
        parameters.longitude = req.body.longitude;
    }

    if(req.body.city){
        parameters.city = req.body.city;
    }
    if(req.body.pincode){
        parameters.pincode = req.body.pincode;
    }

    if(req.body.ifsc){
        parameters.ifsc = req.body.ifsc;
    }
    if(req.body.gst){
        parameters.gst = req.body.gst;
    }
    if(req.body.shop){
        parameters.shop = req.body.shop;
    }
    if(req.body.landline){
        parameters.landline = req.body.landline;
    }
    if(req.body.bankaccout){
        parameters.bankaccount = req.body.bankaccount;
    }
    console.log(parameters);
    UserController.registerUser(parameters)
        .then(function (data) {
            if (data) {
                console.log(data);
                RESPONSE.sendOkay(res, {success: true,data:data});
                return true;
            } else {
                RESPONSE.sendError(res,{success:false,data:"Email Already exist"});
                return false;
            }


        });
});


router.post('/getProfile',function(req,res,next){
    let id = req.body._id;

    profileOperations.getProfile(id)
        .then(function(data){
            if(data){
                RESPONSE.sendOkay(res, {success: true, data: data});
            }else{
                RESPONSE.sendError(res,{success:false,data:'Cant find user with the given credentials'});

            }
        }).catch(function (error) {
        console.log("Error : ", error);
    });

});

router.post('/getNotification',function(req,res,next){
    let id = req.body._id;
    console.log("id:",id);
    notificationOperations.getNotification({user:id})
        .then(function(data){
            if(data){
                console.log(data);
                RESPONSE.sendOkay(res, {success: true, data: data});
            }
        }).catch(function (error) {
        console.log("Error : ", error);
    });
});




router.post('/updateUser', function (req, res, next) {
    let parameter = {
        _id:req.body._id
    };
    let template = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        city:req.body.city,
        address:req.body.address,
        latitude:req.body.latitude,
        longitude:req.body.longitude
    };

    if(req.body.locality){
        template.locality = req.body.locality;
    }

    if(req.body.firstname){
        template.firstname = req.body.firstname;
    }
    if(req.body.city){
        template.city = req.body.city;
    }
    if(req.body.latitude){
        template.latitude = req.body.latitude;
    }
    if(req.body.longitude){
        template.longitude = req.body.longitude;
    }
    if(req.body.shop){
        template.shop = req.body.shop;
    }
    if(req.body.flataddress){
        template.flataddress = req.body.flataddress;
    }

    if(req.body.pincode){
        template.pincode = req.body.pincode;
    }

    ProfileController.updateProfile(parameter,template)
        .then(function (Data) {
            if (Data) {
                console.log(Data);
                RESPONSE.sendOkay(res, Data);
            } else {
                RESPONSE.sendError(res,{success:false,data:'Cant update user with the given credentials'});

                console.log("Some error occured while updating data in the database");
            }
        }).catch(function(err){
        console.log(err);
    });


});

router.post('/activateAccount', function (req, res, next) {
    let parameters = {
        _id:req.body._id,
        activated:req.body.activated
    };
    if(req.body.interest){
        parameters.interest=req.body.interest;
    }

    console.log(parameters);
    ProfileController.updateProfile(parameters)
        .then(function (Data) {
            if (Data) {
                RESPONSE.sendOkay(res, {success: true});
            } else {
                RESPONSE.sendError(res,{success:false,data:'Cant find user with the given credentials'});

                console.log("Some error occured while updating data in the database");
            }
        }).catch(function(err){
        console.log(err);
    });


});

router.post('/forgotPassword',function(req,res){

    let parameters = {
        email: req.body.email
    };

    let pass = customUUID.getRandomAplhaNumeric();

    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user:'gnvikyah6fchyfc7@ethereal.email', // generated ethereal user
                pass: '5RGcANXq5MPuGcnarB' // generated ethereal password
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"AskBin " <sahilayank91@gmail.com>', // sender address
            to: 'sahilayank91@gmail.com', // list of receivers
            subject: 'Hello ✔', // Subject line
            text: 'Your new Password is ' + pass, // plain text body
            html: '<b>Hello world?</b>' // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });

    UserController.changePassword(parameters,{password:pass})
        .then(function (data) {
            if (data.length > 0) {
                RESPONSE.sendOkay(res, {success: true, data: data});
            } else {
                console.log("Some error occured while getting data from the database");
            }
        }).catch(function (err) {
        console.log(err);
    });


});



router.post('/changePasswordUsingPhone',function(req,res){

    let query = {
        $or: [ { phone: { $eq: req.body.phone } }, { phone: { $eq: '+91'+req.body.phone } } ]
    };
    let template = {
        password:req.body.newpass
    };
    console.log(query);
    UserController.changePassword(query, template)
        .then(function (data) {
            if (data) {
                RESPONSE.sendOkay(res, {success: true, data: data});
            } else {
                console.log("Some error occured while getting data from the database");
            }
        }).catch(function (err) {
        console.log(err);
    });


});

router.get('/getLoggedInUser',function(req,res){
    if (!req.session.key) {
        return;
    }
    let parameters = {
        useremail: req.session.email
    };
    UserController.getLoggedInUser(parameters)
        .then(function (data) {
            if (data.length > 0) {

                /*Setting up session parameters*/
                req.session.key = TokenHandler.generateAuthToken(data[0]._id, data[0].role);
                req.session.email = data[0].email;
                req.session.role = data[0].role;


                RESPONSE.sendOkay(res, {success: true, data: data});
            } else {
                console.log("Some error occured while getting data from the database");
            }
        }).catch(function (err) {
        console.log(err);
    });


});


router.post('/checkIfUserExist',function(req,res){

    let parameters={};


    if(req.body.phone){
       parameters.phone = req.body.phone;
    }


    UserController.getUserFullDetail(parameters)
        .then(function(data){
            if(data && data.length>0){
                RESPONSE.sendOkay(res,{success:"true",data:data});
            }else{
                RESPONSE.sendOkay(res,{success:"false",data:data});
            }
        })

});

router.post('/removeUser',function(req,res){

    let parameters={};


    if(req.body._id){
        parameters._id = req.body._id;
    }


    UserController.removeUser(parameters)
        .then(function(data){
            if(data){
                RESPONSE.sendOkay(res,{success:true,data:data});
            }else{
                RESPONSE.sendOkay(res,{success:false,data:data});
            }
        })

});

router.post('/getAllUsers',function(req,res){

    let parameters={};


    if(req.body.role){
        parameters.role = req.body.role;
    }

    UserController.getUserFullDetail(parameters)
        .then(function(data){
            if(data.length>0){
                RESPONSE.sendOkay(res,{success:"true",data:data});
            }else{
                RESPONSE.sendOkay(res,{success:"false",data:data});
            }
        })

});


router.post('/getCredit',function(req,res){
    let parameters = {
        _id:req.body._id
    };

    UserController.getCredit(parameters)
        .then(function(data){
            if(data){
                RESPONSE.sendOkay(res,{success:"true",data:data});
            }else{
                RESPONSE.sendOkay(res,{success:"false",data:data});
            }
        })
});


router.post('/setCredit',function(req,res){
    let parameters = {
        _id:req.body.customerId
    };
    let credit;
    if(req.body.credit){
      credit = req.body.credit;
    }

    UserController.setCredit(parameters,credit)
        .then(function(data){
            if(data){
                RESPONSE.sendOkay(res,{success:"true",data:data});
            }else{
                RESPONSE.sendOkay(res,{success:"false",data:data});
            }
        })
});

router.get('/logout',function(req,res){



    req.session.destroy(function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});



module.exports = router;
