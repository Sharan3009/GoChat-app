import {Cookie} from 'ng2-cookies';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../../user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  public activateUserToken:any;
  constructor(private userService : UserService, private router:Router, private toastr:ToastrService, private activatedRoute : ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params)=>{
      this.activateUserToken = params['verifyToken']
    })
  }
  public verifyFunction: any = (form : NgForm)=>{
    let data={
      email : form.value.email,
      password : form.value.password,
      // activateUserToken : this.activatedRoute.snapshot.paramMap.get('verifyToken')
      activateUserToken : this.activateUserToken
    }
    this.userService.activateUser(data).subscribe((apiResponse)=>{
      if(apiResponse.status === 200){
          Cookie.set('authToken',apiResponse.data.authToken)
          Cookie.set('firstLogin','firstLogin')
          apiResponse.data.userDetails['userName'] = (apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName).trim()
          this.userService.setUserInfoInLocalStorage(apiResponse.data.userDetails)
          this.router.navigate(['/home'])
      } else {
        this.toastr.error(apiResponse.message)
      }
    },(err)=>{
      console.log(err)
      this.toastr.error('Some Error Occured')
    })
  }
}