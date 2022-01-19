import { ContactVM } from './../../model/contact.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-tile',
  templateUrl: './contact-tile.component.html',
  styleUrls: ['./contact-tile.component.scss']
})
export class ContactTileComponent implements OnInit {
  @Input()
  contact?: ContactVM;

  constructor() { }

  ngOnInit(): void {
  }

}
