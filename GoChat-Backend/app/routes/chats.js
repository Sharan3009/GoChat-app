const express = require('express');
const router = express.Router();
const chatController = require("./../../app/controllers/chatController");
const appConfig = require("./../../config/appConfig")
const auth = require('../middlewares/auth')

module.exports.setRouter = (app) => {
    let baseUrl = appConfig.apiVersion + '/chats'

    app.get(baseUrl + '/:roomId', auth.isAuthorized, chatController.getGroupChat)
        /**
	 * @api {get} /api/v1/chats/:roomId Get Room Chats
	 * @apiVersion 0.0.1
	 * @apiGroup Chat 
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
     * @apiParam {String} roomId roomId of the room passed as a route parameter
	 *
	 *  @apiSuccessExample {json} Success-Response:
     * {
            "error": false,
            "message": "All Group Chats Listed",
            "status": 200,
            "data": {
                "chatId": string,
                "senderId": string,
                "senderName": string,
                "chatRoom": string,
                "message": string,
                "createdOn": date
            }
        }
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error occured while getting the Chats",
	    "status": 500,
	    "data": null
	   }
	 */
}