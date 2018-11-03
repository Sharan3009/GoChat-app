import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Cookie } from 'ng2-cookies';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private baseUrl = 'http://localhost:3000/api/v1'
  constructor(private http : HttpClient) { }

  public getAllRooms(): Observable<any> {
    return this.http.get(`${this.baseUrl}/rooms/all?authToken=${Cookie.get('authToken')}`)
  }

  public getYourRooms(userId): Observable<any> {
    return this.http.get(`${this.baseUrl}/rooms/yourRooms/${userId}?authToken=${Cookie.get('authToken')}`)
  }
  
  public getSingleRoom(roomId): Observable<any> {
    return this.http.get(`${this.baseUrl}/rooms/singleRoom/${roomId}?authToken=${Cookie.get('authToken')}`)
  }

  public getRoomChats(roomId,pageValue): Observable<any> {
    return this.http.get(`${this.baseUrl}/chats/${roomId}?skip=${pageValue}&authToken=${Cookie.get('authToken')}`)
  }
}
