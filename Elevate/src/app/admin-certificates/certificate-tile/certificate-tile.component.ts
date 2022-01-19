import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-certificate-tile',
  templateUrl: './certificate-tile.component.html',
  styleUrls: ['./certificate-tile.component.scss']
})
export class CertificateTileComponent implements OnInit {
  @Input()
  certificate: any;
  @Output()
  toggleRecommendation = new EventEmitter<{ id: number, is_recommended: boolean }>();
  @Output()
  toggleEnabled = new EventEmitter<{ id: number, is_enabled: boolean }>();
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  toggleRecommendationClick() {
    if (!this.certificate.is_legal) {
      this.toggleRecommendation.emit({ id: this.certificate.id, is_recommended: !this.certificate.is_recommended });
    }
  }
  toggleEnabledClick() {
    if (!this.certificate.is_legal) {
      this.toggleEnabled.emit({ id: this.certificate.id, is_enabled: !this.certificate.is_enabled });
    }
  }
  goToDetail() {
    if (this.certificate) {
      if (this.certificate.is_legal) {
        this.router.navigate(['/administration/certificates/legal', this.certificate.identifier])
      } else {
        this.router.navigate(['/administration/certificates', this.certificate.id])
      }
    }
  }
}
