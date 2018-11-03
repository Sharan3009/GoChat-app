import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UserService } from './user.service';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { RoomService } from './room.service';
import { SharedModule } from './shared/shared.module';
import { NotFoundModule } from './not-found/not-found.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]),
    FormsModule,
    HttpClientModule,
    UserModule,
    ChatModule,
    SharedModule,
    NotFoundModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [UserService,RoomService],
  bootstrap: [AppComponent]
})
export class AppModule { }
