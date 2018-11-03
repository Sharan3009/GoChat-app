import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import { Observable } from 'rxjs/internal/Observable';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private url = 'http://localhost:3000'
  private socket;

  constructor() {
    this.socket = io(this.url)
  }

  public sendWelcomeEmail = (data) => {
    this.socket.emit('verify-email', data)
  }

  public sendPasswordResetEmail = (data) => {
    this.socket.emit('change-password', data)
  }
}
