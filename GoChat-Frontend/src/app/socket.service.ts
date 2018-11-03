import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import { Observable } from 'rxjs/internal/Observable';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private url = 'http://localhost:3000'
  private socket;

  constructor() {
    // connection is being created (emitting connection)
    this.socket = io(this.url)
   }

   /*----------------Home Component--------------*/

   // for home component
   public verifyUser = () => {
    return Observable.create((observer) => {
      this.socket.on('verifyUser', (data) => {
        observer.next(data);
      });
    }); 
  } 
  // gets emitted right after verify user
  public setUser = (authToken) => {
    this.socket.emit("set-user", authToken);
  }

  public getOnlineNotification = () =>{
    return Observable.create((observer) => {
      this.socket.on('online-notification', (data) => {
        observer.next(data);
      });
    });
  }

  public createRoom = (data) => {
    this.socket.emit('create-room',data)
  }

  public roomSaved=(userId)=>{
    return Observable.create((observer) => {
      this.socket.on(userId, (data) => {
        observer.next(data);
      });
    });
  }

  public getAddedRoom = () => {
    return Observable.create((observer) => {
      this.socket.on('room-list', (data) => {
        observer.next(data);
      });
    }); 
  }

  public updateRoomOnJoin=()=>{
    return Observable.create((observer) => {
      this.socket.on('update-room', (data) => {
        observer.next(data);
      });
    });
  }

  public updateRoomOnEdit=()=>{
    return Observable.create((observer) => {
      this.socket.on('update-edited-room', (data) => {
        observer.next(data);
      });
    });
  }

  public updateRoomOnDelete = () =>{
    return Observable.create((observer) => {
      this.socket.on('update-deleted-room', (data) => {
        observer.next(data);
      });
    });
  }

  public sendGlobalMessage = (chatMsgObject) => {
    this.socket.emit('global-chat-msg', chatMsgObject);
  }

  /*-----------Chat Room Component-------------*/ 
  public startRoom = () =>{
    return Observable.create((observer) => {
      this.socket.on('start-room', (data) => {
        observer.next(data);
      });
    });
  }
  public emitJoinRoom = (data) =>{
    this.socket.emit('join-room',data)
  }

  public appendJoinees = () =>{
    return Observable.create((observer) => {
      this.socket.on('append-joinees', (data) => {
        observer.next(data);
      });
    });
  }

  public onlineUsers = () =>{
    return Observable.create((observer) => {
      this.socket.on('online-user-list', (data) => {
        observer.next(data);
      });
    });
  }

  public removeJoinees = () =>{
    return Observable.create((observer) => {
      this.socket.on('remove-joinees', (data) => {
        observer.next(data);
      });
    });
  }

  public editRoom = (data) => {
    this.socket.emit('edit-room',data)
  }

  public toggleActivate = (data) => {
    this.socket.emit('toggle-activate',data)
  }

  public deleteRoom = (roomId) =>{
    this.socket.emit('delete-room',roomId)
  }

  public redirectOnDelete = () => {
    return Observable.create((observer) => {
      this.socket.on('redirect-on-delete', (data) => {
        observer.next(data);
      });
    });
  }

  public updatedRoom = () => {
    return Observable.create((observer) => {
      this.socket.on('updated-room', (data) => {
        observer.next(data);
      });
    });
  }

  public leaveRoom = (data) =>{
    this.socket.emit('leave-room',data)
  }

  public kickRoom = (data) =>{
    this.socket.emit('kick-room',data)
  }

  public redirectOnKick = (userId) =>{
    return Observable.create((observer) => {
      this.socket.on(userId, (data) => {
        observer.next(data);
      });
    });
  }

  public sendRoomMessage = (chatMsgObject) => {
    this.socket.emit('room-chat-msg', chatMsgObject);
  }

  public receiveRoomMessage = () =>{
    return Observable.create((observer) => {
      this.socket.on('receive-message', (data) => {
        observer.next(data);
      });
    });
  }

  public emitTyping = (user) =>{
    this.socket.emit('typing',user)
  }
  public onTyping = () =>{
    return Observable.create((observer) => {
      this.socket.on('typing', (data) => {
        observer.next(data);
      });
    });
  }
  
     // emitting disconnect
     public disconnect = () => {
      this.socket.disconnect()
    }

    public authError = () => {
      return Observable.create((observer) => {
        this.socket.on('auth-error', (data) => {
          observer.next(data);
        });
      });
    }
}
