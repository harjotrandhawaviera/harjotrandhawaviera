import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-profile-photo',
  templateUrl: './profile-photo.component.html',
  styleUrls: ['./profile-photo.component.scss'],
})
export class ProfilePhotoComponent implements OnChanges {
  @Input()
  type: string | undefined;
  @Input()
  readonly = false;
  @Input()
  photo: any;
  @Input()
  photoPending: any;
  @Input()
  placeholder: string | undefined;
  @Input()
  updateRequest: boolean = false;
  @Output() photoUploaded = new EventEmitter<any>();
  pictures: any;
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.photo || changes.photoPending) {
      this.setPictures();
    }
  }

  private setPictures() {
    this.pictures = {
      current: this.photo && this.photo.url.medium,
      pending: this.photoPending && this.photoPending.url.medium,
    };
  }

  ngOnInit(): void {}
  pictureUploadedCallback(data: any) {
    this.photoUploaded.emit(data);
  }
}
