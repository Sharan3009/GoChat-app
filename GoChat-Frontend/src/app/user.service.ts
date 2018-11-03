import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Cookie } from 'ng2-cookies';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000/api/v1'

  constructor(public http : HttpClient) { }

  public setUserInfoInLocalStorage = (data) =>{
    localStorage.setItem('userInfo',JSON.stringify(data))
  }

  public getUserInfoInLocalStorage = () =>{
    return JSON.parse(localStorage.getItem('userInfo'))
  }

  public signupFunction(data): Observable<any> {
    const params = new HttpParams()
    .set('firstName',data.firstName)
    .set('lastName',data.lastName)
    .set('email',data.email)
    .set('password',data.password)
    .set('mobileNumber',data.mobile);
    return this.http.post(`${this.baseUrl}/users/signup`,params)
  }
  public loginFunction(data): Observable<any> {
    const params = new HttpParams()
    .set('email',data.email)
    .set('password',data.password)
    return this.http.post(`${this.baseUrl}/users/login`,params)
  }
  public activateUser(data): Observable<any> {
    const params = new HttpParams()
    .set('email',data.email)
    .set('password',data.password)
    .set('verifyToken',data.activateUserToken)
    return this.http.post(`${this.baseUrl}/users/verify`,params)
  }

  public validateUserEmail(data): Observable<any> {
    const params = new HttpParams()
    .set('email',data.email)
    return this.http.post(`${this.baseUrl}/users/validate`,params)
  }

  public resetPassword(data): Observable<any> {
    const params = new HttpParams()
    .set('password',data.password)
    .set('resetPasswordToken',data.resetPasswordToken)
    return this.http.post(`${this.baseUrl}/users/reset`,params)
  }

  public logout(data):Observable<any>{
    const params = new HttpParams()
    .set('userId',data.userId)
    return this.http.post(`${this.baseUrl}/users/logout?authToken=${Cookie.get('authToken')}`,params)
  }
  
  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof Error) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return Observable.throw(errorMessage);
  } 
}
