const express = require('express')
const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const token = require('../libs/tokenLib')
const passwordLib = require('../libs/generatePasswordLib')
const uuid = require('uuid')

/* Models */
const UserModel = mongoose.model('User')
const AuthModel = mongoose.model('Auth')

// User Signup function 
let signUpFunction = (req, res) => {
    let validateUserInput = () =>{
        return new Promise((resolve,reject)=>{
            if(req.body.email){
                if(!validateInput.Email(req.body.email)){
                    let apiResponse = response.generate(true,'Email Does not meet the requirement',400,null)
                    reject(apiResponse)
                } else if(!validateInput.Password(req.body.password)){
                    let apiResponse = response.generate(true,'Password must be atleast 8 characters',400,null)
                    reject(apiResponse)
                }
                 else if (check.isEmpty(req.body.password)){
                    let apiResponse = response.generate(true,'password parameter is missing',400,null)
                    reject(apiResponse)
                } else {
                    resolve()
                }
            } else {
                logger.error('Field Missing during User creation','User Controller : validateUserInput' , 5)
                let apiResponse = response.generate(true,'One or more Parameter(s) is missing',400,null)
                reject(apiResponse)
            }
        })
    }

    let createUser = () =>{
        return new Promise((resolve,reject)=>{
            UserModel.findOne({email:req.body.email})
            .exec((err, retrievedUserDetails)=>{
                if(err){
                    logger.error(err.message,'User Controller : createUser',5)
                    let apiResponse = response.generate(true,'Failed to create User',400,null)
                    reject(apiResponse)
                } else if (check.isEmpty(retrievedUserDetails)) {
                    let newUser = new UserModel({
                        userId : shortid.generate(),
                        firstName : req.body.firstName,
                        lastName : req.body.lastName || '',
                        email : req.body.email.toLowerCase(),
                        mobileNumber : req.body.mobileNumber,
                        password : passwordLib.hashpassword(req.body.password),
                        activateUserToken : uuid.v4(),
                        createdOn : time.now()
                    })
                    newUser.save((err,newUser)=>{
                        if(err){
                            console.log(err)
                            logger.error(err.message,'User Controller : createUser', 10)
                            let apiResponse = response.generate(true,'Failed to create new user',400,null)
                            reject(apiResponse)
                        } else {
                            // delete keyword will not working until you convert it to js object using toObject()
                            let newUserObj = newUser.toObject()
                            resolve(newUserObj)
                        }
                    })
                } else {
                    logger.info('User cannot be created. User already present','User Controller : createUser',5)
                    let apiResponse = response.generate(true,'User already present with this email',403,null)
                    reject(apiResponse)
                } 
            })
        })
    }
    validateUserInput(req,res)
    .then(createUser)
    .then((resolve)=>{
        delete resolve.password
        delete resolve._id
        delete resolve.__v
        let apiResponse = response.generate(false,'User created',200,resolve)
        res.send(apiResponse)
    })
    .catch((err)=>{
        console.log(err)
        res.send(err)
    })
} 

// Login function 
let loginFunction = (req, res) => {
    let findUser = () => {
        return new Promise((resolve,reject)=>{
            if(req.body.email){
                UserModel.findOne({email: req.body.email.toLowerCase()},(err,userDetails)=>{
                    if(err){
                        console.log(err)
                        logger.error('Failed to Retrieve User Data', 'User Controller : findUser',5)
                        let apiResponse = response.generate(true,'Failed to find the user',400,null)
                        reject(apiResponse)
                    } else if (check.isEmpty(userDetails) || userDetails.active === false) {
                        logger.error('No User Found','User Controller : findUser',5)
                        let apiResponse = response.generate(true,'No User Details Found',400,null)
                        reject(apiResponse)
                    } else {
                        logger.info('User Found','User Controller : findUser',5)
                        resolve(userDetails)
                    }
                })
            } else {
                let apiResponse = response.generate(true,'email parameter is missing',400,null)
                reject(apiResponse)
            }
        })
    }

    let validatePassword = (retrievedUserDetails) => {
        return new Promise((resolve,reject)=>{
            passwordLib.comparePassword(req.body.password,retrievedUserDetails.password,(err,isMatch)=>{
                if(err){
                    console.log(err)
                    logger.error(err.message,'User Controller : validatePassword',5)
                    let apiResponse = response.generate(true,'Login Failed',500,null)
                    reject(apiResponse)
                } else if (isMatch) {
                    let retrievedUserDetailsObj = retrievedUserDetails.toObject()
                    delete retrievedUserDetailsObj.password
                    delete retrievedUserDetailsObj._id
                    delete retrievedUserDetailsObj.__v
                    delete retrievedUserDetailsObj.createdOn
                    delete retrievedUserDetailsObj.active
                    resolve(retrievedUserDetailsObj)
                } else {
                    logger.error('Login failed due to incorrect password','User Controller : validatePassword',5)
                    let apiResponse = response.generate(true,'Wrong password . Login Failed',500,null)
                    reject(apiResponse)
                }
            })
           
        })
    }

    let generateToken = (userDetails) => {
        return new Promise ((resolve,reject)=>{
            token.generateToken(userDetails,(err,tokenDetails)=>{
                if(err){
                    console.log(err)
                    let apiResponse = response.generate(true,'Failed to generate token',500,null)
                    reject(apiResponse)
                } else {
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    resolve(tokenDetails)
                }
            })
        })
    }

    let saveToken = (tokenDetails) => {
        return new Promise((resolve,reject)=>{
            AuthModel.findOne({userId : tokenDetails.userId })
            .exec((err, retrievedTokenDetails)=>{
                if(err){
                    logger.error(err.message,'User Controller : saveToken',5)
                    let apiResponse = response.generate(true,'Failed to generate token',400,null)
                    reject(apiResponse)
                } else if (check.isEmpty(retrievedTokenDetails)) {
                    let newAuthToken = new AuthModel({
                        userId : tokenDetails.userId,
                        authToken : tokenDetails.token,
                        tokenDetails : tokenDetails.tokenDetails,
                        tokenSecret : tokenDetails.tokenSecret,
                        tokenGenerationTime : time.now()
                    })
                    newAuthToken.save((err,newTokenDetails)=>{
                        if(err){
                            console.log(err)
                            logger.error(err.message,'User Controller : saveToken', 10)
                            let apiResponse = response.generate(true,'Failed to generate new token',400,null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken : newTokenDetails.authToken,
                                userDetails : tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                } else {
                    retrievedTokenDetails.authToken = tokenDetails.token
                    retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret
                    retrievedTokenDetails.tokenGenerationTime = time.now()
                    retrievedTokenDetails.save((err,newTokenDetails)=>{
                        if(err){
                            console.log(err)
                            logger.error(err.message,'User Controller : saveToken',10)
                            let apiResponse = response.generate(true,'Failed to generate Token',400,null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken : newTokenDetails.authToken,
                                userDetails : tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                } 
            })
        })
    }

    findUser(req,res)
    .then(validatePassword)
    .then(generateToken)
    .then(saveToken)
    .then((resolve)=>{
        let apiResponse = response.generate(false,'Login successful',200,resolve)
        res.send(apiResponse)
    })
    .catch((err)=>{
        console.log(err)
        res.send(err)
    })
}

let activateUser = (req, res) => {
    let findUser = () => {
        return new Promise((resolve,reject)=>{
            if(req.body.verifyToken){
                UserModel.findOne({activateUserToken: req.body.verifyToken},(err,userDetails)=>{
                    if(err){
                        console.log(err)
                        logger.error('Failed to Retrieve User Data', 'User Controller : findUser',5)
                        let apiResponse = response.generate(true,'Failed to find the user',400,null)
                        reject(apiResponse)
                    } else if (check.isEmpty(userDetails)) {
                        logger.error('No User Found','User Controller : findUser',5)
                        let apiResponse = response.generate(true,'No User Details Found',400,null)
                        reject(apiResponse)
                    } else {
                        if(req.body.email.toLowerCase() === userDetails.email){
                            logger.info('User Found','User Controller : findUser',5)
                            resolve(userDetails)
                        } else {
                            logger.error('No User Found','User Controller : findUser',5)
                            let apiResponse = response.generate(true,'No User Details Found',400,null)
                            reject(apiResponse)
                        }
                        
                    }
                })
            } else {
                let apiResponse = response.generate(true,'verify Token is missing',400,null)
                reject(apiResponse)
            }
        })
    }

    let validatePassword = (retrievedUserDetails) => {
        return new Promise((resolve,reject)=>{
            passwordLib.comparePassword(req.body.password,retrievedUserDetails.password,(err,isMatch)=>{
                if(err){
                    console.log(err)
                    logger.error(err.message,'User Controller : validatePassword',5)
                    let apiResponse = response.generate(true,'Login Failed',500,null)
                    reject(apiResponse)
                } else if (isMatch) {
                    resolve()
                } else {
                    logger.error('Login failed due to incorrect password','User Controller : validatePassword',5)
                    let apiResponse = response.generate(true,'Wrong password . Login Failed',500,null)
                    reject(apiResponse)
                }
            })
           
        })
    }

    let activateUserToken = ()=>{
        return new Promise((resolve, reject) => {
            let findQuery = {
                activateUserToken: req.body.verifyToken
            }
      
            let updateQuery = {
              active: true,
              $unset : { activateUserToken:1 }
            }
      
            UserModel.findOneAndUpdate(findQuery, updateQuery, {multi: true, new:true})
            .exec((err, result) => {
              if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: activateUser', 10)
                let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
                reject(apiResponse)
              } else {
                let retrievedUserDetailsObj = result.toObject()
                delete retrievedUserDetailsObj.password
                delete retrievedUserDetailsObj._id
                delete retrievedUserDetailsObj.__v
                delete retrievedUserDetailsObj.createdOn
                delete retrievedUserDetailsObj.active
                resolve(retrievedUserDetailsObj)
              }
            })
          })
    }

    let generateToken = (userDetails) => {
        return new Promise ((resolve,reject)=>{
            token.generateToken(userDetails,(err,tokenDetails)=>{
                if(err){
                    console.log(err)
                    let apiResponse = response.generate(true,'Failed to generate token',500,null)
                    reject(apiResponse)
                } else {
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    resolve(tokenDetails)
                }
            })
        })
    }

    let saveToken = (tokenDetails) => {
        return new Promise((resolve,reject)=>{
            AuthModel.findOne({userId : tokenDetails.userId })
            .exec((err, retrievedTokenDetails)=>{
                if(err){
                    logger.error(err.message,'User Controller : saveToken',5)
                    let apiResponse = response.generate(true,'Failed to generate token',400,null)
                    reject(apiResponse)
                } else if (check.isEmpty(retrievedTokenDetails)) {
                    let newAuthToken = new AuthModel({
                        userId : tokenDetails.userId,
                        authToken : tokenDetails.token,
                        tokenDetails : tokenDetails.tokenDetails,
                        tokenSecret : tokenDetails.tokenSecret,
                        tokenGenerationTime : time.now()
                    })
                    newAuthToken.save((err,newTokenDetails)=>{
                        if(err){
                            console.log(err)
                            logger.error(err.message,'User Controller : saveToken', 10)
                            let apiResponse = response.generate(true,'Failed to generate new token',400,null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken : newTokenDetails.authToken,
                                userDetails : tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                } else {
                    retrievedTokenDetails.authToken = tokenDetails.token
                    retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret
                    retrievedTokenDetails.tokenGenerationTime = time.now()
                    retrievedTokenDetails.save((err,newTokenDetails)=>{
                        if(err){
                            console.log(err)
                            logger.error(err.message,'User Controller : saveToken',10)
                            let apiResponse = response.generate(true,'Failed to generate Token',400,null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken : newTokenDetails.authToken,
                                userDetails : tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                } 
            })
        })
    }

    findUser(req,res)
    .then(validatePassword)
    .then(activateUserToken)
    .then(generateToken)
    .then(saveToken)
    .then((resolve)=>{
        let apiResponse = response.generate(false,'Login successful',200,resolve)
        res.send(apiResponse)
    })
    .catch((err)=>{
        console.log(err)
        res.send(err)
    })
}

let forgotPassword = (req,res) => {
    let validateEmail = () =>{
        return new Promise((resolve,reject)=>{
            UserModel.findOne({ email: req.body.email.toLowerCase()},(err,result)=>{
                if(err){
                    logger.error(err.message,'User Controller : validateEmail',10)
                    let apiResponse = response.generate(true,`error occured : ${err.message}`,500,null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)){
                    let apiResponse = response.generate(true,'No User Found',400,null)
                    reject(apiResponse)
                } else {
                    resolve()
                }
            })
        })
        
    }
    let updateResetTokenInUser = ()=>{
        return new Promise((resolve, reject) => {
            let findQuery = {
                email: req.body.email
            }
            let updateQuery = {
              resetPasswordToken: uuid.v4(),
              resetPasswordExpires : Date.now() + 300000 //link expiration after 5 mins
            }
            console.log(uuid.v4())
            UserModel.findOneAndUpdate(findQuery, updateQuery, {multi: true,new:true})
            .exec((err, result) => {
              if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: updateResetTokenInUser', 10)
                let apiResponse = response.generate(true, `Reset Token Failed`, 500, null)
                reject(apiResponse)
              } else {
                  let resultObj = result.toObject()
                  delete resultObj._id
                  delete resultObj.__v
                resolve(resultObj)
              }
            })
          })
        }
    validateEmail(req,res)
    .then(updateResetTokenInUser)
    .then((resolve)=>{
        let apiResponse = response.generate(false,'Reset Token successful',200,resolve)
        res.send(apiResponse)
    })
    .catch((err)=>{
        res.send(err)
    })
}

let resetPassword = (req,res) => {
    let findUser = () =>{
        return new Promise((resolve,reject)=>{
            UserModel.findOne({ resetPasswordToken: req.body.resetPasswordToken, resetPasswordExpires : { $gt: new Date(Date.now())}},(err,result)=>{
                if(err){
                    logger.error(err.message,'User Controller : findUser',10)
                    let apiResponse = response.generate(true,`error occured : ${err.message}`,500,null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)){
                    let apiResponse = response.generate(true,'Link Expired',400,null)
                    reject(apiResponse)
                } else {
                    resolve()
                }
            })
        })
        
    }

    let updatePassword = () =>{
        return new Promise((resolve,reject)=>{
            let updateQuery = {
                password : passwordLib.hashpassword(req.body.password),
                $unset : { resetPasswordToken:1,resetPasswordExpires:1 }
              }
            UserModel.update({ resetPasswordToken: req.body.resetPasswordToken},updateQuery ,(err,result)=>{
                if(err){
                    logger.error(err.message,'User Controller : resetPassword',10)
                    let apiResponse = response.generate(true,`Password update failed`,500,null)
                    reject(apiResponse)
                } else if(!validateInput.Password(req.body.password)){
                    let apiResponse = response.generate(true,`Password must be atleast 8 characters`,400,null)
                    reject(apiResponse)
                } 
                else if (check.isEmpty(result)){
                    let apiResponse = response.generate(true,'No User Found',400,null)
                    reject(apiResponse)
                } else {
                    resolve(result)
                }
            })
        })
        
    }
    findUser(req,res)
    .then(updatePassword)
    .then((resolve)=>{
        let apiResponse = response.generate(false,'Password Successfully Updated',200,resolve)
        res.send(apiResponse)
    })
    .catch((err)=>{
        res.send(err)
    })
}



// Logout function.
let logout = (req, res) => {
    AuthModel.remove({ userId: req.body.userId },(err,result)=>{
        if(err) {
            console.log(err)
            logger.error(err.message , 'User Controller : logout',10)
            let apiResponse = response.generate(true,`error occured : ${err.message}`,500,null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            let apiResponse = response.generate(true,'Already logged out or invalid user',404,null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false,'Logged out successfully',200,result)
            res.send(apiResponse)
        }
    })
}


module.exports = {

    signUpFunction: signUpFunction,
    loginFunction: loginFunction,
    activateUser: activateUser,
    forgotPassword : forgotPassword,
    resetPassword : resetPassword,
    logout: logout

}