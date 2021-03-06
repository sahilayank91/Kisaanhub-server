let User = require(__BASE__ + 'modules/database/models/user');
let customUUID = require(__BASE__ + "modules/utils/CustomUUID");
let Promise = require('bluebird');

const bcrypt = require('bcrypt');

//A template to input the data required at the registration of the user
let getCreateTemplate = function (parameters) {
    if ((!parameters.email && !parameters.phone)) {
        return {};
    }
    let template = {}
    for (let key in parameters) {
        switch (key) {
        	        case '_id':
                    case 'name':
					case 'firstname':
					case 'middlename':
					case 'lastname':
					case 'email':
					case 'phone':
					case 'password':
					case 'profilePic':
					case 'secondary_phone':
					case 'keys':
					case 'gender':
					case 'dob':
					case 'fathername':
					case 'mothername':
                    case 'latitude':
                    case 'longitude':
                    case 'city':
                    case 'pincode':
                    case 'address':
                    case 'role':
                    case 'landline':
                    case 'shop':
                    case 'bankaccount':
                    case 'ifsc':
                    case 'day':
                    case 'month':
                    case 'year':
                    case 'gst':
                    case 'locality':
                    case 'flataddress':
                    case 'credit':
                template[key] = parameters[key];
                break;
        }
    }


    template.created_at = new Date();

    template.password = bcrypt.hashSync(template.password, 10);

    if (!template._id) {
        template._id = customUUID.getRandomAplhaNumeric();
    }

    return template;
};



let createUser = function (parameters) {
	return new Promise(function(resolve, reject) {
		let template = getCreateTemplate(parameters);
			/*Store the user using the template*/
			let user = new User(template);
			user.save(function(err, data) {
				if (!err) {
					resolve(data);
				} else {
                    resolve(false);
                    console.log(err);
					reject(new Error('createUser failed'));
				}
			});
	});
};


let getUsers = function (rule, fields, options) {
    return new Promise(function (resolve, reject) {
        User.find({phone:rule.phone}, fields, options).exec(function (err, data) {
            if (!err) {
                if(data.length>0){
                    if(bcrypt.compareSync(rule.password, data[0].password)===true){
                        resolve(data);
                    } else{
                        reject(new Error('Failed to get Users'));
                    }
                }else{
                    resolve(false);
                }

            } else {
                reject(new Error('Failed to get Users'));
            }
        });
    });
};


let getUserFullDetail = function (rule, fields, options) {
	return new Promise(function (resolve, reject) {
		User.find(rule, fields, options).exec(function (err, data) {
			if (!err) {
				resolve(data);
			} else {
				reject(new Error('Failed to get Users'));
			}
		});
	});
};


let deleteUsers = function(rule,fields,options){
    return new Promise(function (resolve,reject){
            User.remove(rule,fields, options).exec(function(err,data){
                if(!err){
                    resolve(data);
                }else{
                    reject(new Error("Failed to delete Users"));
                }
            });
    });
};

let updateUser = function(rule,fields,options){
  return new Promise(function(resolve,reject){
    User.findOneAndUpdate(rule,fields, {upsert: true}).exec(function(err,data){
        if(!err){
            resolve(data);
        }else{
            reject(new Error("Failed to update Users"));
        }
    });
  });
};

let getUserById = function(rule,fields,options){
    return new Promise(function(resolve,reject){
        User.find(rule,fields,options).exec(function(err,data){
            if(!err){
                resolve(data);
            }else{
                reject(new Error("Failed to get User"));
            }
        });
    });
};


let followUser = function(rule,fields,options){
    return new Promise(function(resolve,reject){
        User.update(rule,fields,options).exec(function(err,data){
            if(!err){
                resolve(data);
            }else{
                reject(new Error("Failed to update Users"));
            }
        });
    });
};

let removeUser = function(rule,fields,options){
    return new Promise(function(resolve,reject){
        User.remove(rule,fields,options).exec(function(err,data){
            if(!err){
                resolve(data);
            }else{
                reject(new Error("Failed to update Users"));
            }
        });
    });
};
let removeFollower = function(rule,fields,options){
    return new Promise(function(resolve,reject){
        User.update(rule,fields,options).exec(function(err,data){
            if(!err){
                resolve(data);
            }else{
                reject(new Error("Failed to update Users"));
            }
        });
    });
};


let unfollowUser = function(rule,fields,options){
    return new Promise(function(resolve,reject){
        User.update(rule,fields,options).exec(function(err,data){
            if(!err){
                resolve(data);
            }else{
                reject(new Error("Failed to update Users"));
            }
        });
    });
};


let changePassword = function(rule,fields,options){
    return new Promise(function(resolve,reject){
        User.update(rule,fields, {upsert: true}).exec(function(err,data){
            if(!err){
                resolve(data);
            }else{
                reject(new Error("Failed to update Users"));
            }
        });
    });
};
let getCredit = function(rule,fields,options){
    return new Promise(function(resolve,reject){
        User.find(rule,{credit:1},options).exec(function(err,data){
                if(!err){
                    resolve(data);
                }else{
                    reject(new Error("Failed to get order"));
                }
            });
    });
};

let setCredit = function(rule,credit,options){
    return new Promise(function(resolve,reject){
        User.findOneAndUpdate(rule,{ $inc: { credit: Math.round(credit) }},options).exec(function(err,data){
            if(!err){
                resolve(data);
            }else{
                reject(new Error("Failed to get order"));
            }
        });
    });
};

let removeCredit = function(rule,credit,options){
    return new Promise(function(resolve,reject){
        User.update(rule,{ $set: { credit: 0 }},options).exec(function(err,data){
            if(!err){
                resolve(data);
            }else{
                reject(new Error("Failed to get order"));
            }
        });
    });
};


module.exports = {
    createUser: createUser,
    getUsers: getUsers,
    updateUser:updateUser,
    getUserById:getUserById,
	getUserFullDetail:getUserFullDetail,
    removeFollower:removeFollower,
    unfollowUser:unfollowUser,
    changePassword:changePassword,
    removeUser:removeUser,
    getCredit:getCredit,
    setCredit:setCredit

};
