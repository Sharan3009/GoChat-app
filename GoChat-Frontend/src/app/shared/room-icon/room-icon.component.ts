import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-room-icon',
  templateUrl: './room-icon.component.html',
  styleUrls: ['./room-icon.component.css']
})
export class RoomIconComponent implements OnInit {
  public userInfo:any;
  constructor(private router : Router, private toastrService : ToastrService, private userService:UserService) { }
  @Input() room
  ngOnInit() {
    this.userInfo = this.userService.getUserInfoInLocalStorage()
  }

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

  public validateAndNavigate:any = (room) =>{
    if(room.joinees.length<room.capacity){
      this.router.navigate(['room',room.roomId])
    } else {
      this.toastrService.error('Please try another room','The Room is full')
    }
  }

}
