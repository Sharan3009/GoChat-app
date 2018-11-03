import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { RoomIconComponent } from './room-icon/room-icon.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ModalComponent, RoomIconComponent],
  exports : [ModalComponent,RoomIconComponent]
})
export class SharedModule { }
