import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { CertificateMappingService } from '../../services/mapping-services';
import { CertificateService } from '../../services/certificate.service';
import { CertificateVM } from '../../model/certificate.model';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-certificate-details-passed',
  templateUrl: './certificate-details-passed.component.html',
  styleUrls: ['./certificate-details-passed.component.scss']
})
export class CertificateDetailsPassedComponent implements OnInit {
  certificate: CertificateVM | undefined;

  constructor(private activatedRoute: ActivatedRoute,
    private certificateService: CertificateService,
    private userService: UserService,
    private certificateMappingService: CertificateMappingService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(res => {
      if (res.id) {
        this.certificateService.getFreelancerCertificate(res.id as number, this.userService.user().roleId()).subscribe(res=>{
          if(res && res.data) {
            this.certificate = this.certificateMappingService.certificateResponseToVM(res.data);
          }
        });
      }
    });
  }

}
