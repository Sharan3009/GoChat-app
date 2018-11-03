import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../socket.service';

@Component({
  selector: 'app-pass-reset',
  templateUrl: './pass-reset.component.html',
  styleUrls: ['./pass-reset.component.css']
})
export class PassResetComponent implements OnInit {
  public resetPasswordToken: any;
  constructor(private userService: UserService, private router: Router, private toastr: ToastrService, private socketService: SocketService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.resetPasswordToken = params['passwordToken']
    })
  }
  public passwordReset: any = (form: NgForm) => {
    let data = {
      password: form.value.password,
      resetPasswordToken: this.resetPasswordToken
    }

    if (form.value.password != form.value.confirmPassword) {
      this.toastr.error('Passwords doesnt match')
    }
    else {
      this.userService.resetPassword(data).subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          this.toastr.success('Password successfully changed')
          setTimeout(() => { this.router.navigate(['/login']) }, 2000)
        } else {
          this.toastr.error(apiResponse.message)
        }
      }, (err) => {
        console.log(err)
        this.toastr.error(err.message)
      })
    }
  }
}
