import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { NotFoundModule } from '../not-found/not-found.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    RouterModule.forChild([
      { path: 'home', component: HomeComponent },
      { path:'room/:roomId',component:ChatRoomComponent}
    ]),
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  declarations: [HomeComponent, ChatRoomComponent]
})
export class ChatModule { }
