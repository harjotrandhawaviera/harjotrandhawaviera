import { Component, Input, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-certificate-tile',
  templateUrl: './certificate-tile.component.html',
  styleUrls: ['./certificate-tile.component.scss']
})
export class CertificateTileComponent implements OnInit {
  @Input()
  certificate: any;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  navigateToDetail() {
    this.router.navigate([
      '/certificates/' +
      (this.certificate.state === 'passed' ? 'my' : 'details'),
      this.certificate.id
    ]);
  }
}
