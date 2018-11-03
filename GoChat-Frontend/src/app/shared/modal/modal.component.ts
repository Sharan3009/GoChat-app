import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input() id //id of modal to open the particular modal only
  @Input() user? // user for kicking particular user
  @Input() title // title of modal
  @Input() buttonName // button name in modal like kick, logout etc
  @Output()
  notify : EventEmitter<String> = new EventEmitter<String>()

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  public buttonClicked:any = () =>{
    this.notify.emit()
  }
  

}
