import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { RoomService } from '../../room.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../socket.service';
import { UserService } from '../../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Cookie } from 'ng2-cookies';
import { Location } from '@angular/common';
import $ from 'jquery';
import { CheckUser } from '../../checkUser';
import { User } from './user';
import { Room } from '../home/room';
import { ChatMessage } from './chat';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css'],
  providers: [SocketService, Location]
})
export class ChatRoomComponent implements OnInit, OnDestroy, CheckUser {
  @ViewChild('scrollMe', { read: ElementRef })
  public scrollMe: ElementRef;
  public roomId: any;
  public room: any;
  public userInfo: any;
  public onlineUsersList = [];
  public authToken: any;
  public joinRoom: any;
  public roomName: any;
  public roomCapacity: any;
  public roomActive: any;
  public roomChat: any;
  public roomFound: boolean;
  public pageValue: any = 0;
  public loadingPreviousChat: boolean = false;
  public isTyping: boolean = false;
  public typer: any;
  public messageList = [];
  public scrollToChatTop: boolean;
  constructor(private roomService: RoomService, private userService: UserService, private location: Location, private router: Router, private toastrService: ToastrService, private socketService: SocketService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    if (this.checkStatus()) {
      this.userInfo = this.userService.getUserInfoInLocalStorage()
      this.roomId = this.activatedRoute.snapshot.paramMap.get('roomId')
      this.authToken = Cookie.get('authToken')
      this.scrollToChatTop = false;
      this.getSingleRoom()
      this.verifyUserConfirmation()
      this.userJoiningRoom()
      this.updatedRoom()
      this.removeJoinees()
      this.redirectOnDelete()
      this.redirectOnKick()
      this.receiveMessage()
      this.onTyping()
      this.onlineUsers()
      this.authError()
    } else {
      this.router.navigate(['login'])
    }

  }
  public checkStatus: any = () => {
    if (Cookie.get('authToken') === undefined || Cookie.get('authToken') === null || Cookie.get('authToken') === '') {
      return false
    } else {
      return true
    }
  }

  public verifyUserConfirmation: any = () => {
    this.socketService.verifyUser().subscribe(
      data => {
        this.socketService.setUser(this.authToken)
      }
    )
  }

  public getSingleRoom: any = () => {
    this.roomService.getSingleRoom(this.roomId).subscribe(
      apiResponse => {
        if (apiResponse.status == 200) {
          this.room = apiResponse['data'];
          this.roomActive = this.room.active;
          this.roomName = this.room.roomName
          this.roomCapacity = this.room.capacity
          this.pageValue = 0;
          //append joinee to room
          this.appendJoinees()
          this.getRoomChats()
        } else {
          this.roomFound = false;
        }
      }, err => {
        console.log(err.message)
      }
    )
  }

  public getRoomChats: any = () => {
    this.roomService.getRoomChats(this.roomId, this.pageValue).subscribe(
      apiResponse => {
        if (apiResponse.status == 200) {
          this.messageList = apiResponse['data']
        } else {
          this.messageList = [];
          this.toastrService.warning('No messages available')
        }

      }, err => {
        console.log(err.message)
      }
    )
    this.scrollToChatTop = false;
  }

  public userJoiningRoom: any = () => {
    let data = {
      roomId: this.roomId,
      userId: this.userInfo.userId,
      userName: this.userInfo.userName
    }
    this.joinRoom = data
    this.socketService.startRoom().subscribe(
      data => {
        this.socketService.emitJoinRoom(this.joinRoom)
      }
    )
  }
  public appendJoinees: any = () => {
    this.socketService.appendJoinees().subscribe(
      data => {
        let newUser:User = { userId: data.userId, userName: data.userName }
        // if user is not present in the room
        if (JSON.stringify(this.room.joinees).indexOf(JSON.stringify(newUser)) === -1) {
          // check if room is not full
          if(this.room.joinees.length<this.room.capacity){
            //if it is not full then push the user into the room and get all the room chats and set room found to true
            this.room.joinees.push({userId:data.userId,userName:data.userName})
            this.roomFound=true;
            //send user joined notification to everyone except to the own
            if (data.userId != this.userInfo.userId) { this.toastrService.success('joined the room', data.userName) }
          } else {
            //if room is full navigate the user to home
            this.router.navigate(['home'])
            this.toastrService.error('Please try another room', 'The Room is full')
          }
        } else {
          //if user is already present in the room set roomfound true and get chat;
          this.roomFound=true;
        }
      }
    )
  }

  public onlineUsers: any = () => {
    this.socketService.onlineUsers().subscribe(
      data => {
        this.onlineUsersList = data;
      }
    )
  }

  //if user is online set it as green else red
  public isOnline: any = (userId) => {
    let onlineUser = this.onlineUsersList[userId]
    if (onlineUser != null && onlineUser != undefined && onlineUser != '') {
      return true
    } else {
      return false;
    }
  }

  public removeJoinees: any = () => {
    this.socketService.removeJoinees().subscribe(
      data => {
        let removeIndexOfAllJoinees = this.room.joinees.map(function (user) { return user.userId }).indexOf(data.userId)
        this.room.joinees.splice(removeIndexOfAllJoinees, 1)
        if (data.userId != this.userInfo.userId) { this.toastrService.error('has left the room', data.userName) }
      }
    )
  }

  public goBackToPreviousPage: any = () => {
    this.location.back()
  }

  public shareRoom: any = () => {
    //creating text area and putting location in it
    let selBox = document.createElement('textarea');
    selBox.value = document.location.hostname + ':' + document.location.port + this.location.path();
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    //deleting the text area after use
    document.body.removeChild(selBox);
    this.toastrService.success('use the link for invitation to the room', 'Url copied to clipboard')
  }
  public editRoom = () => {
    let data:Room = {
      roomId: this.activatedRoute.snapshot.paramMap.get('roomId'),
      roomName: this.roomName,
      capacity: this.roomCapacity,
      ownerId: this.userInfo.userId,
      ownerName: this.userInfo.userName
    }
    this.socketService.editRoom(data)
  }

  public updatedRoom = () =>{
    this.socketService.updatedRoom().subscribe(
      data => {
        this.room = data;
      }
    )
  }

  public toggleActivate: any = (boolean) => {
    this.roomActive = boolean
    let data = {
      roomId: this.activatedRoute.snapshot.paramMap.get('roomId'),
      active: this.roomActive
    }
    this.socketService.toggleActivate(data)
  }

  public deleteRoom: any = () => {
    let roomId = this.activatedRoute.snapshot.paramMap.get('roomId')
    this.socketService.deleteRoom(roomId)
  }

  public redirectOnDelete: any = () => {
    this.socketService.redirectOnDelete().subscribe(
      data => {
        this.router.navigate(['home'])
        this.toastrService.error(data)
      }
    )
  }
  public leaveRoom: any = () => {
    let data = {
      roomId: this.activatedRoute.snapshot.paramMap.get('roomId'),
      userId: this.userInfo.userId,
      userName: this.userInfo.userName
    }
    this.socketService.leaveRoom(data)
    this.router.navigate(['home'])
  }

  public kick: any = (user) => {
    let data = {
      roomId: this.activatedRoute.snapshot.paramMap.get('roomId'),
      userId: user.userId,
      userName: user.userName
    }
    this.socketService.kickRoom(data)
  }

  public redirectOnKick: any = () => {
    this.socketService.redirectOnKick(this.userInfo.userId).subscribe(
      data => {
        this.router.navigate(['home'])
        this.toastrService.error(data[0], data[1])
      }
    )
  }
  public logout: any = () => {
    this.userService.logout(this.userInfo).subscribe(
      data => {
        if (data.status == 200) {
          Cookie.delete('authToken', '/room')
          Cookie.delete('authToken', '/')
          localStorage.clear()
          this.socketService.disconnect();
          this.router.navigate(['/login'])
        } else {
          this.toastrService.warning(data.message)
        }
      }, err => {
        this.toastrService.error(err.message)
      }
    )
  }

  public loadPreviousChat: any = () => {
    this.loadingPreviousChat = true;
    this.pageValue++;
    this.scrollToChatTop = true;
    this.getPreviousChats()
  }

  public getPreviousChats: any = () => {
    this.roomService.getRoomChats(this.roomId, this.pageValue * 20).subscribe(
      apiResponse => {
        if (apiResponse.status == 200) {
          this.messageList = apiResponse.data.concat(this.messageList)
        } else {
          this.toastrService.warning('No more messages available')
        }

      }, err => {
        console.log(err.message)
      }
    )
    this.loadingPreviousChat = false;
  }

  public sendMessageUsingKeypress: any = (event: any) => {
    if (event.keyCode === 13) { // 13 is keycode of enter.
      this.sendMessage();
    } else {
      this.socketService.emitTyping(this.userInfo)
    }
  }

  public onTyping: any = () => {
    let timeout = null
    this.socketService.onTyping().subscribe(
      data => {
        clearTimeout(timeout)
        this.isTyping = true;
        this.typer = data.userName
        timeout = setTimeout(() => { this.isTyping = false }, 800)
      }
    )
  }
  public sendMessage: any = () => {

    if (this.roomChat) {
      let chatMsgObject:ChatMessage = {
        senderName: this.userInfo.userName,
        senderId: this.userInfo.userId,
        message: this.roomChat,
        chatRoom: this.room.roomId,
        createdOn: new Date()
      }// end chatMsgObject

      if (Array.isArray(this.messageList)) {
        this.messageList.push(chatMsgObject)
      } else {
        this.messageList = []
        this.messageList.push(chatMsgObject)
      }
      this.socketService.sendRoomMessage(chatMsgObject)
      this.roomChat = ''
      this.scrollToChatTop = false;
    }
    else {
      this.toastrService.error('Text box cannot be empty')
    }
  }

  public receiveMessage: any = () => {
    this.socketService.receiveRoomMessage().subscribe(
      data => {
        this.isTyping = false;
        if (Array.isArray(this.messageList)) {
          this.messageList.push(data)
        } else {
          this.messageList = []
          this.messageList.push(data)
        }
      }
    )
    this.scrollToChatTop = false;
  }

  //toggle viewmemeber and view chats button on phone screen
  public viewMembers: any = () => {
    $('#members').addClass('d-block')
    $('#members').removeClass('d-none')
    $('#chats').addClass('d-none')
    $('#chats').removeClass('d-block')
    $('#membersButton').addClass('d-none')
    $('#membersButton').removeClass('d-block')
    $('#chatsButton').addClass('d-block')
    $('#chatsButton').removeClass('d-none')
  }

  public viewChats: any = () => {
    $('#chats').addClass('d-block')
    $('#chats').removeClass('d-none')
    $('#members').addClass('d-none')
    $('#members').removeClass('d-block')
    $('#chatsButton').addClass('d-none')
    $('#chatsButton').removeClass('d-block')
    $('#membersButton').addClass('d-block')
    $('#membersButton').removeClass('d-none')
  }

  public authError:any = () =>{
    this.socketService.authError().subscribe(
      data=>{
        this.toastrService.error(data.error)
      }
    )
  }
  ngOnDestroy() {
    this.socketService.disconnect()
  }
}