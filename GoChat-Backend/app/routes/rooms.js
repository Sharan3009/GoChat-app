roomController = require('../controllers/roomController')
const appConfig = require('../../config/appConfig')
const auth = require('../middlewares/auth')

let setRouter = (app) => {
    let baseUrl = appConfig.apiVersion + '/rooms'

    app.get(baseUrl + '/all',auth.isAuthorized, roomController.getAllChatRooms)
     /**
	 * @api {get} /api/v1/rooms/all Get all rooms
	 * @apiVersion 0.0.1
	 * @apiGroup Room 
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
	 *
	 *  @apiSuccessExample {json} Success-Response:
     * {
            "error": false,
            "message": "Rooms Found",
            "status": 200,
            "data": [{
                "roomId": string,
                "roomName" : string,
                "ownerId": string,
                "ownerName": string,
                "capacity": number,
                "active": boolean,
                "joinees": [{"userId" : string,
                            "userName" : string}]
            }]
        }
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error occured while getting all the rooms",
	    "status": 500,
	    "data": null
	   }
	 */
    app.get(baseUrl + '/singleRoom/:roomId',auth.isAuthorized,roomController.getSingleChatRoom)
      /**
	 * @api {get} /api/v1/rooms/singleRoom/:roomId Get Single room
	 * @apiVersion 0.0.1
	 * @apiGroup Room 
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
     * @apiParam {String} roomId roomId of the room passed as a route parameter
	 *
	 *  @apiSuccessExample {json} Success-Response:
     * {
            "error": false,
            "message": "Room Found",
            "status": 200,
            "data": {
                "roomId": string,
                "roomName" : string,
                "ownerId": string,
                "ownerName": string,
                "capacity": number,
                "active": boolean,
                "joinees": [{"userId" : string,
                            "userName" : string}]
            }
        }
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error occured while getting the room",
	    "status": 500,
	    "data": null
	   }
	 */
    app.get(baseUrl + '/yourRooms/:userId',auth.isAuthorized, roomController.getYourRooms)
        /**
	 * @api {get} /api/v1/rooms/yourRooms/:userId Get your rooms
	 * @apiVersion 0.0.1
	 * @apiGroup Room 
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
     * @apiParam {String} userId userId of the user passed as a route parameter
	 *
	 *  @apiSuccessExample {json} Success-Response:
     * {
            "error": false,
            "message": "Rooms Found",
            "status": 200,
            "data": [{
                "roomId": string,
                "roomName" : string,
                "ownerId": string,
                "ownerName": string,
                "capacity": number,
                "active": boolean,
                "joinees": [{"userId" : string,
                            "userName" : string}]
            }]
        }
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error occured while getting your rooms",
	    "status": 500,
	    "data": null
	   }
	 */
}

module.exports = {
    setRouter : setRouter
}