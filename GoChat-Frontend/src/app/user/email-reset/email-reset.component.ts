import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../../user.service';
import { ToastrService } from 'ngx-toastr';
import { EmailService } from '../../email.service';
import { Cookie } from 'ng2-cookies';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-reset',
  templateUrl: './email-reset.component.html',
  styleUrls: ['./email-reset.component.css'],
  providers:[EmailService]
})
export class EmailResetComponent implements OnInit {

  constructor(private userService : UserService, private toastr:ToastrService, private emailService: EmailService, private router:Router) { }

  ngOnInit() {
  }
  
  public emailFunction: any = (form : NgForm)=>{
    let data={
      email : form.value.email.toLowerCase(),
    }
    this.userService.validateUserEmail(data).subscribe((apiResponse)=>{
      if(apiResponse.status === 200){
        data['resetPasswordToken'] = apiResponse.data.resetPasswordToken
          this.emailService.sendPasswordResetEmail(data)
          this.toastr.success(data.email,'Reset link is sent to:')
      } else {
        this.toastr.warning(apiResponse.message)
      }
    },(err)=>{
      console.log(err)
      this.toastr.error(err.message)
    })
  }

}
