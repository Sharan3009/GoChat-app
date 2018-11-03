import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { VerifyComponent } from './verify/verify.component';
import { EmailResetComponent } from './email-reset/email-reset.component';
import { PassResetComponent } from './pass-reset/pass-reset.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild([
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path:'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      /*if the route was verify/:verifyToken for below component
      Step1: Change the route to verify/:verifyToken and in socketLib.js verify-user url to http://localhost:4200/verify/${data.activateUserToken}
      Step2: click on the mail sent on the provided email
      Step3: enter the correct credentials
      Step4: after succesfully signed in, page is redirected to home
      Step5: simply reload the page(home page)
      Output: You will notice the authToken got removed from the cookies
      Conclusion: Hence the parameter is sent through queryParams '?' 
      ***Note to mentor***: If you can provide the proper justification why was that happening*/
      { path:'verify', component: VerifyComponent},
      { path :'forgot', component : EmailResetComponent },
      { path : 'changePassword', component : PassResetComponent}
    ]),
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  declarations: [LoginComponent, SignupComponent, VerifyComponent, EmailResetComponent, PassResetComponent]
})
export class UserModule{
  
 }
