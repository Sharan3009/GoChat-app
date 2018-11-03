import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { RoomService } from '../../room.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../socket.service';
import { UserService } from '../../user.service';
import { Cookie } from 'ng2-cookies';
import { Location } from '@angular/common';
import $ from 'jquery';
import { CheckUser } from '../../checkUser';
import { Room } from './room';
import { ChatMessage } from '../chat-room/chat';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers:[SocketService,Location]
})
export class HomeComponent implements OnInit, OnDestroy,CheckUser{
  @ViewChild('scrollMe', { read: ElementRef })
  public scrollMe: ElementRef;
  public roomId: any;
  public joinRoom:any;
  public authToken:any;
  public allRooms = [];
  public yourRooms = [];
  public onlineUserArray:any;
  public lobbyContent:any;
  public userInfo:any;
  public scrollToChatTop:boolean=false;
  public roomName: any='';
  public roomCapacity: any;
  public globalChat:any;
  constructor(private roomService: RoomService, private userService : UserService,private location:Location, private router: Router, private toastrService: ToastrService, private socketService : SocketService) { }

  ngOnInit() {
    if(this.checkStatus()){
      this.roomId = 'GoChat'
    this.authToken = Cookie.get('authToken')
    this.verifyUserConfirmation()
    this.userInfo = this.userService.getUserInfoInLocalStorage()
    this.userJoiningRoom()
    if(Cookie.get('firstLogin')!==undefined && Cookie.get('firstLogin')!==null && Cookie.get('firstLogin')!==''){
      this.toastrService.success(this.userInfo.userName,'Welcome to GoChat')
      Cookie.delete('firstLogin')
    }
    this.getLobbyContent()
    this.OnlineUserList()
    this.getSavedRooms()
    this.getYourRooms()
    this.updateAllRoomsOnJoin()
    this.updateAllRoomsOnDelete()
    this.addRoomToRoomList()
    this.updateRoomToRoomList()
    this.authError()
    } else {
      this.router.navigate(['login'])
    }
  }

  public checkStatus: any = () => {
    if(Cookie.get('authToken')===undefined || Cookie.get('authToken')===null || Cookie.get('authToken')===''){
      return false
    } else {
      return true
    }
  }

  public verifyUserConfirmation: any = () => {
    this.socketService.verifyUser().subscribe(
      data=>{
        this.socketService.setUser(this.authToken)
      }
    )
  }

  //checking if user is in the room, if not only then join button will be visible
  public checkUserNotInTheRoom:any = (room)=>{
    if (Array.isArray(room.joinees)) {
      let foundUser = room.joinees.map(function (joinee) { return joinee.userId }).indexOf(this.userInfo.userId)
      if(foundUser===-1){
        return true
      } else {
        return false
      }
    }
  }

  //check if room is full, if not only then let it join
  public validateAndNavigate:any = (room) =>{
    if(room.joinees.length<room.capacity){
      this.router.navigate(['room',room.roomId])
    } else {
      this.toastrService.error('Please try another room','The Room is full')
    }
  }

  public userJoiningRoom:any = () => {
    let data={
      roomId : this.roomId,
      userId : this.userInfo.userId,
      userName : this.userInfo.userName
    }
    this.joinRoom = data
    this.socketService.startRoom().subscribe(
      data=>{
        this.socketService.emitJoinRoom(this.joinRoom)
      }
    )
  }

  public getLobbyContent: any =()=>{
    this.socketService.getOnlineNotification().subscribe(
      (data)=>{
        if(Array.isArray(this.lobbyContent)){
          this.lobbyContent.push(data)
        } else {
          this.lobbyContent = []
          this.lobbyContent.push(data)
        }
      }
    )
    this.scrollToChatTop = false;
  }

  //getting global rooms present in the database
  public getSavedRooms = () =>{
    this.roomService.getAllRooms().subscribe(
      data=>{
        this.allRooms = data['data']
      }
    )
  }

  //getting the rooms created or joined by by the logged in user
  public getYourRooms:any = () =>{
    this.roomService.getYourRooms(this.userInfo.userId).subscribe(
      data=>{
        this.yourRooms = data['data'];
      }
    )
  }

  public OnlineUserList:any = ()=>{
    this.socketService.onlineUsers().subscribe(
      data=>{
        this.onlineUserArray = Object.keys(data)
      }
    )
  }

  public createRoom = () =>{
    let data:Room = {
      roomName : this.roomName,
      capacity : this.roomCapacity,
      ownerId : this.userInfo.userId,
      ownerName : this.userInfo.userName,
      joinees : [{userId:this.userInfo.userId , userName: this.userInfo.userName}]
    }
      $('#createRoomModal .cancel').click();
      this.socketService.createRoom(data)
    this.socketService.roomSaved(this.userInfo.userId).subscribe(
      data=>{
          this.router.navigate(['room',data.roomId])
      }
    )
    this.roomName = ''
    this.roomCapacity = ''
  }

  //pushing globally into the roomList which is visible to every signed up user
  public addRoomToRoomList = () =>{
    this.socketService.getAddedRoom().subscribe(
      (data)=>{
        if(Array.isArray(this.allRooms)){
          this.allRooms.push(data)
          this.addRoomToYourRoomList(data)
        } else {
          this.allRooms = []
          this.allRooms.push(data)
          this.addRoomToYourRoomList(data)
      }
    })
  }

  public addRoomToYourRoomList = (data) =>{
    let currentUser = {userId : this.userInfo.userId, userName : this.userInfo.userName}
    if(JSON.stringify(data.joinees).indexOf(JSON.stringify(currentUser))!==-1){
      if (Array.isArray(this.yourRooms)) {
        this.yourRooms.push(data)
      } else {
        this.yourRooms = []
        this.yourRooms.push(data)
      }
    }
  }

  public updateRoomToRoomList = () =>{
    this.socketService.updateRoomOnEdit().subscribe(
      data=>{
        if (Array.isArray(this.allRooms)) {
          let replaceIndexOfAllRooms = this.allRooms.map(function (room) { return room.roomId }).indexOf(data.roomId)
          // console.log(replaceIndexOfAllRooms)
          this.allRooms[replaceIndexOfAllRooms] = data;
        }
        if (Array.isArray(this.yourRooms)) {
          let replaceIndexOfYourRooms = this.yourRooms.map(function (room) { return room.roomId }).indexOf(data.roomId)
          if(replaceIndexOfYourRooms!==-1){
            this.yourRooms[replaceIndexOfYourRooms] = data;
          }
        }
      }
    )
  }

  public updateAllRoomsOnJoin:any =()=>{
    this.socketService.updateRoomOnJoin().subscribe(
      data=>{
        if (Array.isArray(this.allRooms)) {
          let replaceIndexOfAllRooms = this.allRooms.map(function (room) { return room.roomId }).indexOf(data.roomId)
          // console.log(replaceIndexOfAllRooms)
          this.allRooms[replaceIndexOfAllRooms] = data;
        }
        if (Array.isArray(this.yourRooms)) {
          let replaceIndexOfYourRooms = this.yourRooms.map(function (room) { return room.roomId }).indexOf(data.roomId)
          // console.log(replaceIndexOfYourRooms)
          this.yourRooms[replaceIndexOfYourRooms] = data;
        }
      }
    )
  }

  public updateAllRoomsOnDelete:any =()=>{
    this.socketService.updateRoomOnDelete().subscribe(
      data=>{
        if (Array.isArray(this.allRooms)) {
          let replaceIndexOfAllRooms = this.allRooms.map(function (room) { return room.roomId }).indexOf(data)
          // console.log(replaceIndexOfAllRooms)
          this.allRooms.splice(replaceIndexOfAllRooms,1)
        }
        if (Array.isArray(this.yourRooms)) {
          let replaceIndexOfYourRooms = this.yourRooms.map(function (room) { return room.roomId }).indexOf(data)
          // console.log(replaceIndexOfYourRooms)
          if(replaceIndexOfYourRooms!==-1){
            this.yourRooms.splice(replaceIndexOfYourRooms,1)
          }
        }
        
      }
    )
  }

  public sendMessageUsingKeypress: any = (event: any) => {
    if (event.keyCode === 13) { // 13 is keycode of enter.
      this.sendMessage();
    }
  }
  public sendMessage: any = () => {

    if(this.globalChat){
      let chatMsgObject:ChatMessage = {
        senderName: this.userInfo.userName,
        senderId: this.userInfo.userId,
        message: this.globalChat,
        createdOn: new Date(),
        chatRoom : 'GoChat'
      } // end chatMsgObject
      this.socketService.sendGlobalMessage(chatMsgObject)
      this.globalChat=''
      this.scrollToChatTop = false;
    }
    else{
      this.toastrService.error('Text box cannot be empty')
    }

  }

  public goBackToPreviousPage:any=()=>{
    this.location.back()
  }
  public logout: any = () => {
    this.userService.logout(this.userInfo).subscribe(
      data => {
        if (data.status == 200) {
          Cookie.delete('authToken','/room')
          Cookie.delete('authToken','/')
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

  public yourRoomsView:any = () =>{
    $('#yourRooms').addClass('d-block')
    $('#yourRooms').removeClass('d-none')
    $('#globalRooms').addClass('d-none')
    $('#globalRooms').removeClass('d-block')
    $('#globalChat').addClass('d-none')
    $('#globalChat').removeClass('d-block')
    
  }

  public globalChatView:any = () =>{
    $('#yourRooms').addClass('d-none')
    $('#yourRooms').removeClass('d-block')
    $('#globalRooms').addClass('d-none')
    $('#globalRooms').removeClass('d-block')
    $('#globalChat').addClass('d-block')
    $('#globalChat').removeClass('d-none')
  }

  public globalRoomsView:any = () =>{
    $('#yourRooms').addClass('d-none')
    $('#yourRooms').removeClass('d-block')
    $('#globalRooms').addClass('d-block')
    $('#globalRooms').removeClass('d-none')
    $('#globalChat').addClass('d-none')
    $('#globalChat').removeClass('d-block')
  }

  public authError:any = () =>{
    this.socketService.authError().subscribe(
      data=>{
        this.toastrService.error(data.error)
      }
    )
  }

  ngOnDestroy(){
    this.socketService.disconnect()
  }
}
