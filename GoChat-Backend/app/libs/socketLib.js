const mongoose = require('mongoose')
const socketio = require('socket.io')
const events = require('events')
const eventEmitter = new events.EventEmitter()
const ChatModel = mongoose.model('Chat')
const RoomModel = mongoose.model('Room')
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')
const tokenLib = require('./tokenLib')
const shortid = require('shortid')
const redisLib = require('./redisLib')


let setServer = (server) => {
    let io = socketio.listen(server)
    let myIo = io.of('')  //namespace

    /*--------estabilishing connection using service.ts---------------*/
    myIo.on('connection', (socket) => {

        /*----------sending verify email to the signedup user-----------*/
         /**
	 * @api {emit} verify-email Sending verification welcome email
	 * @apiVersion 0.0.1
	 * @apiGroup Emit 
     *@apiDescription This event <b>("verify-email")</b> has to be emitted when a user signs up to send confirmation email.
     *@apiExample The following data has to be emitted
        *{
            "email":string,
            "firstName":string,
            "lastName" : string,
            "activateUserToken":string
        }
     */
        socket.on('verify-email', (data) => {

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport(smtpTransport({
                service: 'Gmail',
                auth: {
                    user: 'gochat30091994@gmail.com',
                    pass: 'Password@94'
                }
            }));
            let mailOptions = {
                from: '"GoChat" <Admin@GoChat.com>', // sender address
                to: data.email, // list of receivers
                subject: 'Welcome to GoChat', // Subject line
                html: `Hi ${data.firstName} ${data.lastName},<br><br>
                Welcome to the Go Chat App where you can create group chats and have fun with new people as well with your friends.<br>Please Click <a href="http://localhost:4200/verify?verifyToken=${data.activateUserToken}" >here</a> to verify your email and continue with our sevices.<br><br> Warm Regards,<br>GoChat Team` // html body
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
            });
        })


     /**
	 * @api {emit} change-password Sending change password email
	 * @apiVersion 0.0.1
	 * @apiGroup Emit 
     *@apiDescription This event <b>("change-password")</b> has to be emitted when a user inputs his email to receive forget password email.
     *@apiExample The following data has to be emitted
        *{
            "email":string,
            "resetPasswordToken":string
        }
     */
        /*-------------sending email to the user for resetting password------------*/
        socket.on('change-password', (data) => {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport(smtpTransport({
                service: 'Gmail',
                auth: {
                    user: 'gochat30091994@gmail.com',
                    pass: 'Password@94'
                }
            }));
            let mailOptions = {
                from: '"GoChat" <Admin@GoChat.com>', // sender address
                to: data.email, // list of receivers
                subject: 'Reset Password', // Subject line
                html: `Hi,<br><br>If you are receiving this email, You have forgotten the password on GoChat.<br>To reset the password Click the <a href="http://localhost:4200/changePassword?passwordToken=${data.resetPasswordToken}">link</a><br><b>The link will expire in 5 minutes</b><br><br>Warm Regards,<br>GoChat Team` // html body
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
            });
        })

        /*----------- Emitting verify User to verify start verifying the logged in user-----------*/
        /**
	 * @api {listen} verifyUser Verification of user
	 * @apiVersion 0.0.1
	 * @apiGroup Listen 
	 *@apiDescription This event <b>("verifyUser")</b> has to be listened on the user's end to verify user authentication.
        User will only be set as online user after verification of authentication token.
     */
        socket.emit('verifyUser', '')
        /**
	 * @api {emit} set-user Setting user online
	 * @apiVersion 0.0.1
	 * @apiGroup Emit 
	 *@apiDescription This event <b>("set-user")</b> has to be emitted when a user comes online.
        User can only be set as online into online user hash only after verification of authentication token. Which you have pass here. The following data has to be emitted
     */
        socket.on('set-user', (authToken) => {
            tokenLib.verifyClaimWithoutSecret(authToken, (err, result) => {
                if (err) {
                	/**
                             * @api {listen} auth-error Emitting auth error on fail of token verification
                             * @apiVersion 0.0.1
                             * @apiGroup Listen 
                             *@apiDescription This event <b>("auth-error")</b> has to be listened by the current room and will be triggered if there comes any auth-token error
                              *@apiExample The example data as output
                                *{
                                   {
                                    "status": 500,
                                    "error": Please provide correct auth token
                                    }
                                }
                            */
                    socket.emit('auth-error',{status:500, error:'Please provide correct auth token'})
                } else {
                    let currentUser = result.data
                    socket.userId = currentUser.userId
                    socket.userName = (currentUser.firstName + ' ' + currentUser.lastName).trim()
                    let key = socket.userId
                    let value = socket.userName
                    redisLib.setANewOnlineUserInHash('onlineUsers',key,value,(err,result)=>{
                        if(err){
                            console.log('some error occured while setting in redis')
                        } else {
                            console.log('user successfully added to online')
                        }
                    })
                }

                 /**
                 * @api {listen} start-room Starting the room
                 * @apiVersion 0.0.1
                 * @apiGroup Listen 
                 *@apiDescription This event <b>("start-room")</b> has to be listened to start any room, even the lobby if there is any.
                    Only then the user will be able to join the room
                */
                socket.emit('start-room','')
                     /**
                     * @api {emit} join-room Joining the current room
                     * @apiVersion 0.0.1
                     * @apiGroup Emit 
                     *@apiDescription This event ("join-room") has to be emitted when a room is started.
                      *@apiExample The following data has to be emitted
                        *{
                            "roomId":string,
                            "userId":string,
                            "userName":string
                        }
                    */
                    socket.on('join-room',(data)=>{
                        socket.room = data.roomId
                        console.log('joining '+socket.room)
                        socket.join(data.roomId)
                        redisLib.getAllUsersInHash('onlineUsers',(err,result)=>{
                            if(err){
                                console.log(err)
                            } else {
                                console.log(socket.userName + ' is online')
                                 /**
                                 * @api {listen} online-user-list Getting online users
                                 * @apiVersion 0.0.1
                                 * @apiGroup Listen 
                                 *@apiDescription This event <b>("online-user-list")</b> has to be listened after joining of any room to get online users.
                                */
                                io.sockets.emit('online-user-list',result)
                            }
                        })
                         /**
                         * @api {listen} online-notification Getting user joined/left notification in lobby
                         * @apiVersion 0.0.1
                         * @apiGroup Listen 
                         *@apiDescription This event <b>("online-notification")</b> has to be listened to display if the user joined the lobby or left the lobby. Output of this will be an array of length 2 with first
                         element as the username and second element as joined or left.
                          *@apiExample The example data as output
                        *{
                            ["userName",' joined']
                            Or
                            ["userName",' left']
                        }
                        */
                        io.sockets.in(socket.room).emit('online-notification', [socket.userName, ' joined'])
                        /**
                     * @api {emit} global-chat-msg Sending message temporarily (not saving in the database)
                     * @apiVersion 0.0.1
                     * @apiGroup Emit 
                     *@apiDescription This event <b>("global-chat-msg")</b> has to be emitted after joining the room to send the message temporarily (for example in lobby) and simultaneously
                     * listening to <b>'online-notification'</b> to display the message to everyone (including yourself). The 'online-notification' event will have the following data in the form of array <b>[userName,' : ', message]</b>
                      *@apiExample The following data has to be emitted
                        *{
                            {
                                "senderName": string,
                                "senderId": string,
                                "message": string,
                                "chatRoom" : string
                            }
                        }
                    */
                        socket.on('global-chat-msg', (data) => {
                        io.sockets.in(socket.room).emit('online-notification', [data.senderName, ' : ', data.message])
                        })
                           /**
                     * @api {emit} typing Emit which user is typing
                     * @apiVersion 0.0.1
                     * @apiGroup Emit 
                     *@apiDescription This event <b>("typing")</b> has to be emitted in the room in order to display which user is typing to others.
                      *@apiExample The following data has to be emitted
                        *{
                            {
                                "userId": string,
                                "userName": string
                            }
                        }
                    */
                        socket.on('typing',data=>{
                            /**
                         * @api {listen} typing Getting which user is typing
                         * @apiVersion 0.0.1
                         * @apiGroup Listen 
                         *@apiDescription This event <b>("typing")</b> has to be listened to display to other users, which user is typing (emitting the 'typing' event)
                        */
                            socket.to(socket.room).broadcast.emit('typing',data)
                        })
                        if(socket.room != 'GoChat'){
                            setTimeout(function () { eventEmitter.emit('append-joinees', data) }, 2000)
                               /**
                             * @api {listen} append-joinees Adding user to to current room
                             * @apiVersion 0.0.1
                             * @apiGroup Listen 
                             *@apiDescription This event <b>("append-joinees")</b> has to be listened by the current room to append joinee to joined list instantaenously
                             after the join. The roomName should not be 'GoChat' as it is the default name of lobby for this api.
                              *@apiExample The example data as output
                                *{
                                   {
                                    "senderName": string,
                                    "senderId": string,
                                    "message": string,
                                    "chatRoom" : string
                                    }
                                }
                            */
                            io.sockets.in(socket.room).emit('append-joinees',data)
                        }
                    })
                        /**
                     * @api {emit} create-room Create room
                     * @apiVersion 0.0.1
                     * @apiGroup Emit 
                     *@apiDescription This event <b>("create-room")</b> has to be emitted while creating the room.
                      *@apiExample The following data has to be emitted
                        *{
                            {
                                "roomName" : string,
                                "capacity" : string,
                                "ownerId" : string,
                                "ownerName" : string,
                                "joinees" : [{"userId":string,"userName":string}]
                            }
                        }
                    */
                    socket.on('create-room', (data) => {
                        data['roomId'] = shortid.generate()
                        eventEmitter.emit('save-room', data)
                    })
                       /**
                     * @api {emit} edit-room Edit room
                     * @apiVersion 0.0.1
                     * @apiGroup Emit 
                     *@apiDescription This event <b>("edit-room")</b> has to be emitted while editing the room.
                      *@apiExample The following data has to be emitted
                        *{
                            {
                                "roomId":string,
                                "roomName" : string,
                                "capacity" : string,
                                "ownerId" : string,
                                "ownerName" : string
                            }
                        }
                    */
                    socket.on('edit-room', (data) => {
                        eventEmitter.emit('edit-room', data)
                    })
                     /**
                     * @api {emit} toggle-room Toggle room active or closed
                     * @apiVersion 0.0.1
                     * @apiGroup Emit 
                     *@apiDescription This event <b>("toggle-room")</b> has to be emitted setting room as active or closed.
                      *@apiExample The following data has to be emitted
                        *{
                            {
                                "roomId":string,
                                "active" : boolean
                            }
                        }
                    */
                    socket.on('toggle-activate', (data) => {
                        eventEmitter.emit('toggle-activate', data)
                    })
                     /**
                     * @api {emit} delete-room Delete room
                     * @apiVersion 0.0.1
                     * @apiGroup Emit 
                     *@apiDescription This event <b>("delete-room")</b> has to be emitted while deleting the room. The data it must contain is <b>roomId</b> only
                      
                    */
                    socket.on('delete-room',(roomId)=>{
                        eventEmitter.emit('delete-room',roomId)
                        setTimeout(function(){eventEmitter.emit('delete-room-chats',roomId)},2000)
                           /**
                             * @api {listen} update-deleted-room Updating room in lobby after deletion
                             * @apiVersion 0.0.1
                             * @apiGroup Listen 
                             *@apiDescription This event <b>("update-deleted-room")</b> has to be listened in the lobby ('GoChat') to update room list there.Example data containes <b>roomId</b> only.
                            */
                        io.sockets.in('GoChat').emit('update-deleted-room', roomId)
                        /**
                             * @api {listen} redirect-on-delete Redirecting to home everyone on delete room
                             * @apiVersion 0.0.1
                             * @apiGroup Listen 
                             *@apiDescription This event <b>("redirect-on-delete")</b> has to be listened by the current room in order to redirect all users to lobby. The data it contains is
                             a string <b>'The Room was deleted'</b>
                            */
                        io.sockets.in(roomId).emit('redirect-on-delete','The Room was deleted')
                    })
                    /**
                     * @api {emit} leave-room Leaving the current room
                     * @apiVersion 0.0.1
                     * @apiGroup Emit 
                     *@apiDescription This event <b>("leave-room")</b> has to be emitted while leaving the room.
                      *@apiExample The following data has to be emitted
                        *{
                            "roomId":string,
                            "userId":string,
                            "userName":string
                        }
                    */
                    socket.on('leave-room',(data)=>{
                        eventEmitter.emit('leave-room',data)
                           /**
                             * @api {listen} remove-joinees Removing user from current room
                             * @apiVersion 0.0.1
                             * @apiGroup Listen 
                             *@apiDescription This event <b>("remove-joinees")</b> has to be listened by the current room to remove joinee from joined list instantaenously
                             after the leave or been kicked.
                              *@apiExample The example data as output
                                *{
                                   {
                                    "senderName": string,
                                    "senderId": string,
                                    "message": string,
                                    "chatRoom" : string
                                    }
                                }
                            */
                        io.sockets.in(socket.room).emit('remove-joinees',data)
                    })
                    /**
                     * @api {emit} kick-room Kicking user frmo the current room
                     * @apiVersion 0.0.1
                     * @apiGroup Emit 
                     *@apiDescription This event <b>("kick-room")</b> has to be emitted while kicking the user from room.
                      *@apiExample The following data has to be emitted
                        *{
                            "roomId":string,
                            "userId":string,
                            "userName":string
                        }
                    */
                    socket.on('kick-room',(data)=>{
                        eventEmitter.emit('kick-room',data)
                        io.sockets.in(socket.room).emit('remove-joinees',data)
                    })
                      /**
                     * @api {emit} room-chat-msg Sending message in room and saving it in database
                     * @apiVersion 0.0.1
                     * @apiGroup Emit 
                     *@apiDescription This event <b>("room-chat-msg")</b> has to be emitted after joining the room to send the message.
                      *@apiExample The following data has to be emitted
                        *{
                            {
                                "senderName": string,
                                "senderId": string,
                                "message": string,
                                "chatRoom" : string,
                                "createdOn": date
                            }
                        }
                    */
                    socket.on('room-chat-msg', (data) => {
                        data['chatId'] = shortid.generate()
                        setTimeout(function(){eventEmitter.emit('save-chat',data)},2000)
                         /**
                             * @api {listen} receive-message Receiving message by other users in the chatroom
                             * @apiVersion 0.0.1
                             * @apiGroup Listen 
                             *@apiDescription This event <b>("receive-message")</b> has to be listened by all the users in order to receive the broadcasted message
                              *@apiExample The example data as output
                                *{
                                   {
                                    "senderName": string,
                                    "senderId": string,
                                    "message": string,
                                    "chatRoom" : string,
                                    "createdOn":date
                                    }
                                }
                            */
                        socket.to(data.chatRoom).broadcast.emit('receive-message', data)
                        })
            })
        })
        
        socket.on('disconnect', () => {
            if (socket.room == 'GoChat') {
                io.sockets.in(socket.room).emit('online-notification', [socket.userName, ' left'])
            }
            if(socket.userId){
                redisLib.deleteUserFromHash('onlineUsers',socket.userId)
                redisLib.getAllUsersInHash('onlineUsers',(err,result)=>{
                    if(err){
                        console.log(err)    
                    } else {
                        io.sockets.emit('online-user-list',result)
                        socket.leave(socket.room)
                    }
                })
            }
        })
    })
    eventEmitter.on('save-room', (data) => {
        let newRoom = new RoomModel({
    
            roomId: data.roomId,
            roomName: data.roomName,
            capacity: data.capacity,
            ownerId: data.ownerId,
            ownerName: data.ownerName,
            joinees: [{ userId: data.ownerId, userName: data.ownerName }]
        });
    
        newRoom.save((err, result) => {
            if (err) {
                console.log(`error occurred: ${err}`);
            }
            else if (result == undefined || result == null || result == "") {
                console.log("Room Is Not Saved.");
            }
            else {
                console.log("Room Saved.");
                /**
                 * @api {listen} userId Redirecting the current user who is creating the room or who has been kicked
                 * @apiVersion 0.0.1
                 * @apiGroup Listen 
                 *@apiDescription This event <b>("userId")</b> has to be listened to redirect the creater of room to created room only or redirect the user to homepage who has been kicked out.The example data after kicked is an array of 2 strings
                  <b>['Be Nice next time','You have been kicked from the room']</b>
                    *@apiExample The example data as output for create room is
                    *{
                        {
                            "roomName" : string,
                            "capacity" : string,
                            "ownerId" : string,
                            "ownerName" : string,
                            "joinees" : [{userId:string,userName:string}]
                        }
                    }
                */
                myIo.emit(result.ownerId,result)
                /**
                 * @api {listen} room-list Updating room in lobby after creation
                 * @apiVersion 0.0.1
                 * @apiGroup Listen 
                 *@apiDescription This event <b>("room-list")</b> has to be listened in the lobby ('GoChat') to update room list there after room creation.
                 *@apiExample The example data as output
                    *{
                        {
                            "roomName" : string,
                            "capacity" : string,
                            "ownerId" : string,
                            "ownerName" : string,
                            "joinees" : [{userId:string,userName:string}]
                        }
                    }
                */
                io.sockets.in('GoChat').emit('room-list', result)
            }
        });
    })
    eventEmitter.on('edit-room', (data) => {
        let findQuery = {
            roomId : data.roomId
        }
        let updateQuery = {
            roomName : data.roomName,
            capacity : data.capacity
        }
    
        RoomModel.findOneAndUpdate(findQuery,updateQuery,{new:true},(err, result) => {
            if (err) {
                console.log(`error occurred: ${err}`);
            }
            else if (result == undefined || result == null || result == "") {
                console.log("Room Is Not Updated.");
            }
            else {
                console.log("Room Updated.");
                /**
                 * @api {listen} updated-room Updating room after editing the current room
                 * @apiVersion 0.0.1
                 * @apiGroup Listen 
                 *@apiDescription This event <b>("updated-room")</b> has to be listened in the current room to reflect changes to all the users present in the room.
                 *@apiExample The example data as output
                    *{
                        {
                            "roomId":string,
                            "roomName" : string,
                            "capacity" : string,
                            "ownerId" : string,
                            "ownerName" : string
                        }
                    }
                */
                io.sockets.in(data.roomId).emit('updated-room', result)
                /**
                 * @api {listen} update-edited-room Updating room after editing in the lobby('GoChat')
                 * @apiVersion 0.0.1
                 * @apiGroup Listen 
                 *@apiDescription This event <b>("update-edited-room")</b> has to be listened in the lobby to reflect changes to all the users present in lobby.
                 *@apiExample The example data as output
                    *{
                        {
                            "roomId":string,
                            "roomName" : string,
                            "capacity" : string,
                            "ownerId" : string,
                            "ownerName" : string
                        }
                    }
                */
                io.sockets.in('GoChat').emit('update-edited-room', result)
            }
        });
    })
    eventEmitter.on('toggle-activate', (data) => {
        let findQuery = {
            roomId : data.roomId
        }
        let updateQuery = {
            active : data.active,
        }
    
        RoomModel.findOneAndUpdate(findQuery,updateQuery,{new:true},(err, result) => {
            if (err) {
                console.log(`error occurred: ${err}`);
            }
            else if (result == undefined || result == null || result == "") {
                console.log("Room Is Not Updated.");
            }
            else {
                console.log("Room Updated.");
                io.sockets.in('GoChat').emit('update-edited-room', result)
            }
        });
    })
    eventEmitter.on('delete-room', (roomId) => {
        RoomModel.remove({roomId:roomId},(err, result) => {
            if (err) {
                console.log(`error occurred: ${err}`);
            }
            else if (result == undefined || result == null || result == "") {
                console.log("Room Is Not Deleted.");
            }
            else {
                console.log("Room Deleted.");
            }
        });
    })
    eventEmitter.on('append-joinees', (data) => {
        let findQuery = {
            roomId: data.roomId
        }
        let updateQuery = {
            $addToSet: {
                joinees: {
                    userId: data.userId,
                    userName: data.userName
                }
            }
        }
        RoomModel.findOne(findQuery,(err,result)=>{
            if (err) {
                console.log(`error occurred: ${err}`);
            }
            else if (result == undefined || result == null || result == "") {
                console.log("Room Is Not Found while updating");
            }
            else {
                if(result.joinees.length+1<=result.capacity){
                    RoomModel.findOneAndUpdate(findQuery, updateQuery,{new:true}, (err, result) => {
                        if (err) {
                            console.log(`error occurred: ${err}`);
                        }
                        else if (result == undefined || result == null || result == "") {
                            console.log("Room Is Not Updated.");
                        }
                        else {
                            console.log("Room Updated.");
                            io.sockets.in('GoChat').emit('update-edited-room', result)
                        }
                    });
                } else {
                    console.log('Room was full')
                }
            }
        })
        
    })
    eventEmitter.on('leave-room', (data) => {
        let findQuery = {
            roomId: data.roomId
        }
        let updateQuery = {
            $pull: {
                joinees: {
                    userId: data.userId,
                    userName: data.userName
                }
            }
        }
        RoomModel.findOneAndUpdate(findQuery, updateQuery,{new:true}, (err, result) => {
            if (err) {
                console.log(`error occurred: ${err}`);
            }
            else if (result == undefined || result == null || result == "") {
                console.log("Room Is Not left.");
            }
            else {
                console.log("Room left.");
                 /**
                 * @api {listen} update-room Updating room in the lobby('GoChat') after leaving or kicking from a room
                 * @apiVersion 0.0.1
                 * @apiGroup Listen 
                 *@apiDescription This event <b>("update-room")</b> has to be listened in the lobby to reflect changes to all the users present in lobby.
                 *@apiExample The example data as output
                    *{
                        {
                            "roomId":string,
                            "userId":string,
                            "userName":string
                        }
                    }
                */
                io.sockets.in('GoChat').emit('update-room', result)
            }
        });
    })
    eventEmitter.on('kick-room', (data) => {
        let findQuery = {
            roomId: data.roomId
        }
        let updateQuery = {
            $pull: {
                joinees: {
                    userId: data.userId,
                    userName: data.userName
                }
            }
        }
        RoomModel.findOneAndUpdate(findQuery, updateQuery,{new:true}, (err, result) => {
            if (err) {
                console.log(`error occurred: ${err}`);
            }
            else if (result == undefined || result == null || result == "") {
                console.log("Room Is Not left.");
            }
            else {
                console.log("Room left.");
                console.log(result);
                // socket.emit('redirect-on-join', result)
                myIo.emit(data.userId,['Be Nice next time','You have been Kicked from the room'])
                io.sockets.in('GoChat').emit('update-room', result)
            }
        });
    })
}
eventEmitter.on('save-chat', (data) => {

    let newChat = new ChatModel({
        chatId: data.chatId,
        senderName: data.senderName,
        senderId: data.senderId,
        message: data.message,
        chatRoom: data.chatRoom || '',
        createdOn: data.createdOn
    });

    newChat.save((err, result) => {
        if (err) {
            console.log(`error occurred: ${err}`);
        }
        else if (result == undefined || result == null || result == "") {
            console.log("Chat Is Not Saved.");
        }
        else {
            console.log("Chat Saved.");
        }
    });

});

  /**
 * @api {emit} delete-room-chats Deleting room chats after room is deleted
 * @apiVersion 0.0.1
 * @apiGroup Emit 
 *@apiDescription This event <b>("delete-room-chats")</b> has to be emitted the room is deleted. The data which is emitting is only <b>roomId</b>
*/
eventEmitter.on('delete-room-chats', (roomId) => {
    ChatModel.deleteMany({chatRoom:roomId},(err, result) => {
        if (err) {
            console.log(`error occurred: ${err}`);
        }
        else if (result == undefined || result == null || result == "") {
            console.log("Chat Is Not Deleted.");
        }
        else {
            console.log("Chats Deleted.");
        }
    });
})


module.exports = {
    setServer: setServer
}