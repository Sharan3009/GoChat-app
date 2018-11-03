const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const passwordLib = require('./../libs/generatePasswordLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const token = require('../libs/tokenLib')
const ChatModel = mongoose.model('Chat')

let getGroupChat = (req, res) => {
    // function to validate params.
    let validateParams = () => {
      return new Promise((resolve, reject) => {
        if (check.isEmpty(req.params.roomId)) {
          logger.info('parameters missing', 'getUsersChat handler', 9)
          let apiResponse = response.generate(true, 'parameters missing.', 403, null)
          reject(apiResponse)
        } else {
          resolve()
        }
      })
    } // end of the validateParams function.
  
    // function to get chats.
    let findChats = () => {
      return new Promise((resolve, reject) => {
        // creating find query.
        let findQuery = {
          chatRoom: req.params.roomId
        }
  
        ChatModel.find(findQuery)
          .select('-_id -__v')
          .sort('-createdOn')
          .skip(parseInt(req.query.skip) || 0)
          .lean()
          .limit(20)
          .exec((err, result) => {
            if (err) {
              console.log(err)
              logger.error(err.message, 'Chat Controller: getUsersChat', 10)
              let apiResponse = response.generate(true, 'Error occured while getting the Chats', 500, null)
              reject(apiResponse)
            } else if (check.isEmpty(result)) {
              logger.info('No Chat Found', 'Chat Controller: getUsersChat')
              let apiResponse = response.generate(true, 'No Chat Found', 404, null)
              reject(apiResponse)
            } else {
              resolve(result.reverse())
            }
          })
      })
    } // end of the findChats function.
  
    // making promise call.
    validateParams(req,res)
      .then(findChats)
      .then((result) => {
        let apiResponse = response.generate(false, 'All Group Chats Listed', 200, result)
        res.send(apiResponse)
      })
      .catch((error) => {
        res.send(error)
      })
  }

  module.exports = {
    getGroupChat : getGroupChat
}