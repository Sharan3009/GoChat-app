import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmailService } from '../../email.service';
import { Cookie } from 'ng2-cookies';
import { CheckUser } from '../../checkUser';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers:[EmailService]
})
export class SignupComponent implements OnInit, CheckUser {

  constructor(private userService: UserService,private emailService:EmailService, private router: Router, private toastr:ToastrService) { }
  ngOnInit() {
    if(this.checkStatus()){
      this.router.navigate(['home'])
    }
  }

  public checkStatus: any = () => {
    if(Cookie.get('authToken')===undefined || Cookie.get('authToken')===null || Cookie.get('authToken')===''){
      return false
    } else {
      return true
    }
  }

  public signupFunction: any = (form : NgForm)=>{
    let data={
      firstName: form.value.firstName,
      lastName : form.value.lastName || '',
      email : form.value.email.toLowerCase(),
      password : form.value.password,
    }
    if(form.value.password != form.value.confirmPassword){
      this.toastr.error('Passwords doesnt match')
    }
    else{
      this.userService.signupFunction(data).subscribe((apiResponse)=>{
        if(apiResponse.status === 200){
          data['activateUserToken'] = apiResponse.data.activateUserToken
          this.emailService.sendWelcomeEmail(data)
          this.toastr.success(data.email,'Verification email sent to:')
          setTimeout(()=>{
            this.router.navigate(['/'])
          },2000)
        } else {
          this.toastr.warning(apiResponse.message)
        }
      },(err)=>{
        console.log(err)
        this.toastr.error(err.message)
      })
    }
  }
}
