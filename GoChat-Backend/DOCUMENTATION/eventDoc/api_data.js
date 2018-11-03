define({ "api": [
  {
    "type": "emit",
    "url": "change-password",
    "title": "Sending change password email",
    "version": "0.0.1",
    "group": "Emit",
    "description": "This event <b>(&quot;change-password&quot;)</b> has to be emitted when a user inputs his email to receive forget password email.",
    "examples": [
      {
        "title": "The following data has to be emitted",
        "content": "{\n            \"email\":string,\n            \"resetPasswordToken\":string\n        }",
        "type": "json"
      }
    ],
    "filename": "libs/socketLib.js",
    "groupTitle": "Emit",
    "name": "EmitChangePassword"
  },
  {
    "type": "emit",
    "url": "create-room",
    "title": "Create room",
    "version": "0.0.1",
    "group": "Emit",
    "description": "This event <b>(&quot;create-room&quot;)</b> has to be emitted while creating the room.",
    "examples": [
      {
        "title": "The following data has to be emitted",
        "content": "{\n                            {\n                                \"roomName\" : string,\n                                \"capacity\" : string,\n                                \"ownerId\" : string,\n                                \"ownerName\" : string,\n                                \"joinees\" : [{\"userId\":string,\"userName\":string}]\n                            }\n                        }",
        "type": "json"
      }
    ],
    "filename": "libs/socketLib.js",
    "groupTitle": "Emit",
    "name": "EmitCreateRoom"
  },
  {
    "type": "emit",
    "url": "delete-room",
    "title": "Delete room",
    "version": "0.0.1",
    "group": "Emit",
    "description": "This event <b>(&quot;delete-room&quot;)</b> has to be emitted while deleting the room. The data it must contain is <b>roomId</b> only",
    "filename": "libs/socketLib.js",
    "groupTitle": "Emit",
    "name": "EmitDeleteRoom"
  },
  {
    "type": "emit",
    "url": "delete-room-chats",
    "title": "Deleting room chats after room is deleted",
    "version": "0.0.1",
    "group": "Emit",
    "description": "This event <b>(&quot;delete-room-chats&quot;)</b> has to be emitted the room is deleted. The data which is emitting is only <b>roomId</b>",
    "filename": "libs/socketLib.js",
    "groupTitle": "Emit",
    "name": "EmitDeleteRoomChats"
  },
  {
    "type": "emit",
    "url": "edit-room",
    "title": "Edit room",
    "version": "0.0.1",
    "group": "Emit",
    "description": "This event <b>(&quot;edit-room&quot;)</b> has to be emitted while editing the room.",
    "examples": [
      {
        "title": "The following data has to be emitted",
        "content": "{\n                            {\n                                \"roomId\":string,\n                                \"roomName\" : string,\n                                \"capacity\" : string,\n                                \"ownerId\" : string,\n                                \"ownerName\" : string\n                            }\n                        }",
        "type": "json"
      }
    ],
    "filename": "libs/socketLib.js",
    "groupTitle": "Emit",
    "name": "EmitEditRoom"
  },
  {
    "type": "emit",
    "url": "global-chat-msg",
    "title": "Sending message temporarily (not saving in the database)",
    "version": "0.0.1",
    "group": "Emit",
    "description": "This event <b>(&quot;global-chat-msg&quot;)</b> has to be emitted after joining the room to send the message temporarily (for example in lobby) and simultaneously listening to <b>'online-notification'</b> to display the message to everyone (including yourself). The 'online-notification' event will have the following data in the form of array <b>[userName,' : ', message]</b>",
    "examples": [
      {
        "title": "The following data has to be emitted",
        "content": "{\n                            {\n                                \"senderName\": string,\n                                \"senderId\": string,\n                                \"message\": string,\n                                \"chatRoom\" : string\n                            }\n                        }",
        "type": "json"
      }
    ],
    "filename": "libs/socketLib.js",
    "groupTitle": "Emit",
    "name": "EmitGlobalChatMsg"
  },
  {
    "type": "emit",
    "url": "join-room",
    "title": "Joining the current room",
    "version": "0.0.1",
    "group": "Emit",
    "description": "This event <b>(&quot;join-room&quot;)</b> has to be emitted when a room is started.",
    "examples": [
      {
        "title": "The following data has to be emitted",
        "content": "{\n                            \"roomId\":string,\n                            \"userId\":string,\n                            \"userName\":string\n                        }",
        "type": "json"
      }
    ],
    "filename": "libs/socketLib.js",
    "groupTitle": "Emit",
    "name": "EmitJoinRoom"
  },
  {
    "type": "emit",
    "url": "kick-room",
    "title": "Kicking user from the current room",
    "version": "0.0.1",
    "group": "Emit",
    "description": "This event <b>(&quot;kick-room&quot;)</b> has to be emitted while kicking the user from room.",
    "examples": [
      {
        "title": "The following data has to be emitted",
        "content": "{\n                            \"roomId\":string,\n                            \"userId\":string,\n                            \"userName\":string\n                        }",
        "type": "json"
      }
    ],
    "filename": "libs/socketLib.js",
    "groupTitle": "Emit",
    "name": "EmitKickRoom"
  },
  {
    "type": "emit",
    "url": "leave-room",
    "title": "Leaving the current room",
    "version": "0.0.1",
    "group": "Emit",
    "description": "This event <b>(&quot;leave-room&quot;)</b> has to be emitted while leaving the room.",
    "examples": [
      {
        "title": "The following data has to be emitted",
        "content": "{\n                            \"roomId\":string,\n                            \"userId\":string,\n                            \"userName\":string\n                        }",
        "type": "json"
      }
    ],
    "filename": "libs/socketLib.js",
    "groupTitle": "Emit",
    "name": "EmitLeaveRoom"
  },
  {
    "type": "emit",
    "url": "room-chat-msg",
    "title": "Sending message in room and saving it in database",
    "version": "0.0.1",
    "group": "Emit",
    "description": "This event <b>(&quot;room-chat-msg&quot;)</b> has to be emitted after joining the room to send the message.",
    "examples": [
      {
        "title": "The following data has to be emitted",
        "content": "{\n                            {\n                                \"senderName\": string,\n                                \"senderId\": string,\n                                \"message\": string,\n                                \"chatRoom\" : string,\n                                \"createdOn\": date\n                            }\n                        }",
        "type": "json"
      }
    ],
    "filename": "libs/socketLib.js",
    "groupTitle": "Emit",
    "name": "EmitRoomChatMsg"
  },
  {
    "type": "emit",
    "url": "set-user",
    "title": "Setting user online",
    "version": "0.0.1",
    "group": "Emit",
    "description": "This event <b>(&quot;set-user&quot;)</b> has to be emitted when a user comes online. User can only be set as online into online user hash only after verification of authentication token. Which you have pass here. The following data has to be emitted",
    "filename": "libs/socketLib.js",
    "groupTitle": "Emit",
    "name": "EmitSetUser"
  },
  {
    "type": "emit",
    "url": "toggle-room",
    "title": "Toggle room active or closed",
    "version": "0.0.1",
    "group": "Emit",
    "description": "This event <b>(&quot;toggle-room&quot;)</b> has to be emitted setting room as active or closed.",
    "examples": [
      {
        "title": "The following data has to be emitted",
        "content": "{\n                            {\n                                \"roomId\":string,\n                                \"active\" : boolean\n                            }\n                        }",
        "type": "json"
      }
    ],
    "filename": "libs/socketLib.js",
    "groupTitle": "Emit",
    "name": "EmitToggleRoom"
  },
  {
    "type": "emit",
    "url": "typing",
    "title": "Emit which user is typing",
    "version": "0.0.1",
    "group": "Emit",
    "description": "This event <b>(&quot;typing&quot;)</b> has to be emitted in the room in order to display which user is typing to others.",
    "examples": [
      {
        "title": "The following data has to be emitted",
        "content": "{\n                            {\n                                \"userId\": string,\n                                \"userName\": string\n                            }\n                        }",
        "type": "json"
      }
    ],
    "filename": "libs/socketLib.js",
    "groupTitle": "Emit",
    "name": "EmitTyping"
  },
  {
    "type": "emit",
    "url": "verify-email",
    "title": "Sending verification welcome email",
    "version": "0.0.1",
    "group": "Emit",
    "description": "This event <b>(&quot;verify-email&quot;)</b> has to be emitted when a user signs up to send confirmation email.",
    "examples": [
      {
        "title": "The following data has to be emitted",
        "content": "{\n            \"email\":string,\n            \"firstName\":string,\n            \"lastName\" : string,\n            \"activateUserToken\":string\n        }",
        "type": "json"
      }
    ],
    "filename": "libs/socketLib.js",
    "groupTitle": "Emit",
    "name": "EmitVerifyEmail"
  },
  {
    "type": "listen",
    "url": "append-joinees",
    "title": "Adding user to to current room",
    "version": "0.0.1",
    "group": "Listen",
    "description": "This event <b>(&quot;append-joinees&quot;)</b> has to be listened by the current room to append joinee to joined list instantaenously after the join. The roomName should not be 'GoChat' as it is the default name of lobby for this api.",
    "examples": [
      {
        "title": "The example data as output",
        "content": "{\n                                   {\n                                    \"senderName\": string,\n                                    \"senderId\": string,\n                                    \"message\": string,\n                                    \"chatRoom\" : string\n                                    }\n                                }",
        "type": "json"
      }
    ],
    "filename": "libs/socketLib.js",
    "groupTitle": "Listen",
    "name": "ListenAppendJoinees"
  },
    {
    "type": "listen",
    "url": "auth-error",
    "title": "Emitting auth error on fail of token verification",
    "version": "0.0.1",
    "group": "Listen",
    "description": "This event <b>(&quot;auth-error&quot;)</b> has to be listened by the current room and will be triggered if there comes any auth-token error",
    "examples": [
      {
        "title": "The example data as output",
        "content": "{\n                                   {\n                                    \"status\": 500,\n                                    \"error\": 'Please provide correct auth token'                                   }\n                                }",
        "type": "json"
      }
    ],
    "filename": "libs/socketLib.js",
    "groupTitle": "Listen",
    "name": "ListenAuthError"
  },
  {
    "type": "listen",
    "url": "online-notification",
    "title": "Getting user joined/left notification in lobby",
    "version": "0.0.1",
    "group": "Listen",
    "description": "This event <b>(&quot;online-notification&quot;)</b> has to be listened to display if the user joined the lobby or left the lobby. Output of this will be an array of length 2 with first element as the username and second element as joined or left.",
    "examples": [
      {
        "title": "The example data as output",
        "content": "{\n                            [\"userName\",' joined']\n                            Or\n                            [\"userName\",' left']\n                        }",
        "type": "json"
      }
    ],
    "filename": "libs/socketLib.js",
    "groupTitle": "Listen",
    "name": "ListenOnlineNotification"
  },
  {
    "type": "listen",
    "url": "online-user-list",
    "title": "Getting online users",
    "version": "0.0.1",
    "group": "Listen",
    "description": "This event <b>(&quot;online-user-list&quot;)</b> has to be listened after joining of any room to get online users.",
    "filename": "libs/socketLib.js",
    "groupTitle": "Listen",
    "name": "ListenOnlineUserList"
  },
  {
    "type": "listen",
    "url": "receive-message",
    "title": "Receiving message by other users in the chatroom",
    "version": "0.0.1",
    "group": "Listen",
    "description": "This event <b>(&quot;receive-message&quot;)</b> has to be listened by all the users in order to receive the broadcasted message",
    "examples": [
      {
        "title": "The example data as output",
        "content": "{\n                                   {\n                                    \"senderName\": string,\n                                    \"senderId\": string,\n                                    \"message\": string,\n                                    \"chatRoom\" : string,\n                                    \"createdOn\":date\n                                    }\n                                }",
        "type": "json"
      }
    ],
    "filename": "libs/socketLib.js",
    "groupTitle": "Listen",
    "name": "ListenReceiveMessage"
  },
  {
    "type": "listen",
    "url": "redirect-on-delete",
    "title": "Redirecting to home everyone on delete room",
    "version": "0.0.1",
    "group": "Listen",
    "description": "This event <b>(&quot;redirect-on-delete&quot;)</b> has to be listened by the current room in order to redirect all users to lobby. The data it contains is a string <b>'The Room was deleted'</b>",
    "filename": "libs/socketLib.js",
    "groupTitle": "Listen",
    "name": "ListenRedirectOnDelete"
  },
  {
    "type": "listen",
    "url": "remove-joinees",
    "title": "Removing user from current room",
    "version": "0.0.1",
    "group": "Listen",
    "description": "This event <b>(&quot;remove-joinees&quot;)</b> has to be listened by the current room to remove joinee from joined list instantaenously after the leave or been kicked.",
    "examples": [
      {
        "title": "The example data as output",
        "content": "{\n                                   {\n                                    \"senderName\": string,\n                                    \"senderId\": string,\n                                    \"message\": string,\n                                    \"chatRoom\" : string\n                                    }\n                                }",
        "type": "json"
      }
    ],
    "filename": "libs/socketLib.js",
    "groupTitle": "Listen",
    "name": "ListenRemoveJoinees"
  },
  {
    "type": "listen",
    "url": "room-list",
    "title": "Updating room in lobby after creation",
    "version": "0.0.1",
    "group": "Listen",
    "description": "This event <b>(&quot;room-list&quot;)</b> has to be listened in the lobby ('GoChat') to update room list there after room creation.",
    "examples": [
      {
        "title": "The example data as output",
        "content": "{\n                        {\n                            \"roomName\" : string,\n                            \"capacity\" : string,\n                            \"ownerId\" : string,\n                            \"ownerName\" : string,\n                            \"joinees\" : [{userId:string,userName:string}]\n                        }\n                    }",
        "type": "json"
      }
    ],
    "filename": "libs/socketLib.js",
    "groupTitle": "Listen",
    "name": "ListenRoomList"
  },
  {
    "type": "listen",
    "url": "start-room",
    "title": "Starting the room",
    "version": "0.0.1",
    "group": "Listen",
    "description": "This event <b>(&quot;start-room&quot;)</b> has to be listened to start any room, even the lobby if there is any. Only then the user will be able to join the room",
    "filename": "libs/socketLib.js",
    "groupTitle": "Listen",
    "name": "ListenStartRoom"
  },
  {
    "type": "listen",
    "url": "typing",
    "title": "Getting which user is typing",
    "version": "0.0.1",
    "group": "Listen",
    "description": "This event <b>(&quot;typing&quot;)</b> has to be listened to display to other users, which user is typing (emitting the 'typing' event)",
    "filename": "libs/socketLib.js",
    "groupTitle": "Listen",
    "name": "ListenTyping"
  },
  {
    "type": "listen",
    "url": "update-deleted-room",
    "title": "Updating room in lobby after deletion",
    "version": "0.0.1",
    "group": "Listen",
    "description": "This event <b>(&quot;update-deleted-room&quot;)</b> has to be listened in the lobby ('GoChat') to update room list there.Example data containes <b>roomId</b> only.",
    "filename": "libs/socketLib.js",
    "groupTitle": "Listen",
    "name": "ListenUpdateDeletedRoom"
  },
  {
    "type": "listen",
    "url": "update-edited-room",
    "title": "Updating room after editing in the lobby('GoChat')",
    "version": "0.0.1",
    "group": "Listen",
    "description": "This event <b>(&quot;update-edited-room&quot;)</b> has to be listened in the lobby to reflect changes to all the users present in lobby.",
    "examples": [
      {
        "title": "The example data as output",
        "content": "{\n                        {\n                            \"roomId\":string,\n                            \"roomName\" : string,\n                            \"capacity\" : string,\n                            \"ownerId\" : string,\n                            \"ownerName\" : string\n                        }\n                    }",
        "type": "json"
      }
    ],
    "filename": "libs/socketLib.js",
    "groupTitle": "Listen",
    "name": "ListenUpdateEditedRoom"
  },
  {
    "type": "listen",
    "url": "update-room",
    "title": "Updating room in the lobby('GoChat') after leaving or kicking from a room",
    "version": "0.0.1",
    "group": "Listen",
    "description": "This event <b>(&quot;update-room&quot;)</b> has to be listened in the lobby to reflect changes to all the users present in lobby.",
    "examples": [
      {
        "title": "The example data as output",
        "content": "{\n                        {\n                            \"roomId\":string,\n                            \"userId\":string,\n                            \"userName\":string\n                        }\n                    }",
        "type": "json"
      }
    ],
    "filename": "libs/socketLib.js",
    "groupTitle": "Listen",
    "name": "ListenUpdateRoom"
  },
  {
    "type": "listen",
    "url": "updated-room",
    "title": "Updating room after editing the current room",
    "version": "0.0.1",
    "group": "Listen",
    "description": "This event <b>(&quot;updated-room&quot;)</b> has to be listened in the current room to reflect changes to all the users present in the room.",
    "examples": [
      {
        "title": "The example data as output",
        "content": "{\n                        {\n                            \"roomId\":string,\n                            \"roomName\" : string,\n                            \"capacity\" : string,\n                            \"ownerId\" : string,\n                            \"ownerName\" : string\n                        }\n                    }",
        "type": "json"
      }
    ],
    "filename": "libs/socketLib.js",
    "groupTitle": "Listen",
    "name": "ListenUpdatedRoom"
  },
  {
    "type": "listen",
    "url": "userId",
    "title": "Redirecting the current user who is creating the room or who has been kicked",
    "version": "0.0.1",
    "group": "Listen",
    "description": "This event <b>(&quot;userId&quot;)</b> has to be listened to redirect the creater of room to created room only or redirect the user to homepage who has been kicked out.The example data after kicked is an array of 2 strings <b>['Be Nice next time','You have been kicked from the room']</b>",
    "examples": [
      {
        "title": "The example data as output for create room is",
        "content": "{\n                        {\n                            \"roomName\" : string,\n                            \"capacity\" : string,\n                            \"ownerId\" : string,\n                            \"ownerName\" : string,\n                            \"joinees\" : [{userId:string,userName:string}]\n                        }\n                    }",
        "type": "json"
      }
    ],
    "filename": "libs/socketLib.js",
    "groupTitle": "Listen",
    "name": "ListenUserid"
  },
  {
    "type": "listen",
    "url": "verifyUser",
    "title": "Verification of user",
    "version": "0.0.1",
    "group": "Listen",
    "description": "This event <b>(&quot;verifyUser&quot;)</b> has to be listened on the user's end to verify user authentication. User will only be set as online user after verification of authentication token.",
    "filename": "libs/socketLib.js",
    "groupTitle": "Listen",
    "name": "ListenVerifyuser"
  }
] });
