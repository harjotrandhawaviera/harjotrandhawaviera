import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { CertificateMappingService } from './../../services/mapping-services/certificate-mapping.service';
import { CertificateService } from '../../services/certificate.service';
import { CertificateVM } from '../../model/certificate.model';

@Component({
  selector: 'app-certificate-details',
  templateUrl: './certificate-details.component.html',
  styleUrls: ['./certificate-details.component.scss']
})
export class CertificateDetailsComponent implements OnInit {
  certificate: CertificateVM | undefined;

  constructor(private activatedRoute: ActivatedRoute,
    private certificateService: CertificateService,
    private certificateMappingService: CertificateMappingService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(res => {
      if (res.id) {
        this.certificateService.getCertificateById(res.id as number).subscribe(res=>{
          if(res && res.data) {
            this.certificate = this.certificateMappingService.certificateResponseToVM(res.data);
          }
        });
      }
    });
  }

}
