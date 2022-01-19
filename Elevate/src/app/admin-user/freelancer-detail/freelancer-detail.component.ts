import * as moment from 'moment';

import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';

import { FileExportService } from './../../services/file-export.service';
import { FormConfig } from '../../constant/forms.constant';
import { FreelancerMappingService } from './../../services/mapping-services/freelancer-mapping.service';
import { FreelancerResponse } from '../../model/freelancer.response';
import { FreelancerService } from './../../services/freelancer.service';
import { FreelancerVM } from '../models/freelancer.model';
import { MapService } from '../../services/map.service';
import { SingleResponse } from '../../model/response';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from './../../services/translate.service';
import { UserConfig } from '../../constant/user.constant';
import { UserService } from './../../services/user.service';
import { UserVM } from '../models/user.model';
import { UsersService } from './../../services/users.service';
import { environment } from './../../../environments/environment';
import {HttpClient, HttpEventType, HttpHeaders} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {PreviewDownloadPopupComponent} from "../../admin-freelancer/preview-download-popup/preview-download-popup.component";

@Component({
  selector: 'app-freelancer-detail',
  templateUrl: './freelancer-detail.component.html',
  styleUrls: ['./freelancer-detail.component.scss'],
})
export class FreelancerDetailComponent implements OnInit, OnChanges {
  @Input() userDetail: UserVM | undefined | null;
  freelancer: FreelancerVM | undefined = undefined;
  temp: any;
  slides = [
    {
      thumbImage:
        'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/5.jpg',
      title: 'Hummingbirds are amazing creatures',
    },
    {
      image:
        'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/9.jpg',
      thumbImage:
        'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/9.jpg',
    },
    {
      image:
        'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/4.jpg',
      thumbImage:
        'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/4.jpg',
      title: 'Example with title.',
    },
    {
      image:
        'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/7.jpg',
      thumbImage:
        'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/7.jpg',
      title: 'Hummingbirds are amazing creatures',
    },
    {
      image:
        'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/1.jpg',
      thumbImage:
        'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/1.jpg',
    },
    {
      image:
        'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/2.jpg',
      thumbImage:
        'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/2.jpg',
      title: 'Example two with title.',
    },
  ];
  data: any;
  languageLK: { text: string; value: string; }[];
  documentsColumns = [
    'documents',
    'name',
    'size',
    'type',
    'action'
  ];
  allowed: { rating?: any; disabling?: any; deactivating?: any; } = {};
  mapLoaded: Observable<boolean> = of(false);
  constructor(
    private freelancerService: FreelancerService,
    private translateService: TranslateService,
    private userService: UserService,
    private fileExportService: FileExportService,
    private usersService: UsersService,
    private toastrService: ToastrService,
    private http: HttpClient,
    private dialog: MatDialog,
    private mapService: MapService,
    private freelancerMappingService: FreelancerMappingService) {

    this.languageLK = FormConfig.master.languages.map((a) => {
      return {
        text: a,
        value: a,
      };
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.userDetail) {
      if (this.userDetail && this.userDetail.id && this.userDetail.role === 'freelancer') {
        this.allowed = {
          rating: this.userService.user().isAllowed('manage-ratings'),
          disabling: this.userService.user().isAllowed('disable-users') && this.userService.user().id() !== this.userDetail.id,
          deactivating: (this.userDetail.role === 'freelancer' && this.userService.user().isAllowed('deactivate-freelancers')) || (this.userService.user().isAllowed('deactivate-users') && this.userService.user().id() !== this.userDetail.id)
        }
        forkJoin([this.freelancerService.getFreelancerAllData(this.userDetail.freelancer.data.id, true),
        this.freelancerService.getFreelancerGtcDocuments({ freelancerId: this.userDetail.freelancer.data.id, include: 'freelancer_documents' })])
          .subscribe(result => {
            const freelancerRes = result[0] as SingleResponse<FreelancerResponse>;
            const docRes = result[1];
            if (freelancerRes.data) {
              this.updateDetails(freelancerRes.data, docRes);
            }
          }, error => {
            if (this.userDetail?.freelancer?.data) {
              this.updateDetails(this.userDetail?.freelancer?.data, null)
            }
          })
      }
    }
  }

  private updateDetails(freelancerRes: FreelancerResponse, docRes: any) {
    const freelancer = this.freelancerMappingService.freelancerResponseToVM(
      freelancerRes,
      docRes
    );
    this.data = {
      details: freelancer
    };
    this.translateService.get('common.users.name-unavailable').subscribe(res => {
      this.data.details.fullname = this.data.details.fullname || res;
    });
    this.data.details.sliderPictures = [this.data.details.orgPictures.current.body, ...this.data.details.orgPictures.current.additional];
    delete this.data.details.documents.original;
    delete this.data.details.documents.pending;
    delete this.data.details.documents.current.report;
    this.data.documents = [];
    for (const key in freelancer.documents.current) {
      if (Object.prototype.hasOwnProperty.call(freelancer.documents.current, key)) {
        const doc = freelancer.documents.current[key];
        doc.typeName = this.translateService.instant('administration.users.details.documents.type.' + key);
        this.data.documents = this.data.documents.concat(doc.is_collection ? doc.documents.map((d: any) => {
          d.typeName = doc.typeName;
          return d;
        }) : [doc]);
      }
    }
    if (freelancer.user && freelancer.user.active_at) {
      this.data.online =
        freelancer.user.active_at &&
        moment
          .utc(freelancer.user.active_at)
          .isAfter(moment().subtract(UserConfig.activeTime.value, 'minutes'));
    }
    // this.data.online = freelancer.user.data.active_at && moment(freelancer.user.data.active_at)
    //   .isAfter(moment().subtract(config.user.activeTime.value, config.user.activeTime.unit));
    // this.data.avatar = freelancer.face_picture_id && profile.avatar(freelancer.face_picture_id);
    var languages = (freelancer.languages && freelancer.languages.split(',')) || [];
    var availableLanguages = FormConfig.master.languages.map(a => {
      return {
        id: a,
        label: 'profile.fields.languages.' + a
      };
    });
    var languagesMap: any = {};
    availableLanguages.forEach((lang) => {
      languagesMap[lang.id] = lang.label;
    });

    this.data.details.languages = {
      native: languagesMap[languages[0]],
      additional: languages.splice(1).map((language) => {
        return languagesMap[language];
      })
    };
    // freelancer.certificates?.forEach((certificate) => {
    //   certificate.passed_at = format.date(certificate.passed_at);
    // });
    // ratings - extract own and the rest
    this.data.rating = freelancer.ratings?.filter(a => a.user_id === this.userService.user().id()).pop();
    if (this.data.rating && freelancer.ratings) {
      freelancer.ratings.splice(freelancer.ratings.indexOf(this.data.rating), 1);
    }
    this.data.ratings = freelancer.ratings;
    this.data.details.status = this.data?.details?.user?.status;
    this.data.details.email = this.data?.details?.user?.email;
  }

  ngOnInit(): void {
    this.mapLoaded = this.mapService.loadMap();
    // this.d();
  }

  downloadSedcard() {
    this.translateService.get('common.labels.unnamed').subscribe(res => {
      this.fileExportService.getDownload({ url: environment.api + `/freelancers/${this.data.details.id}/sedcards/current`, fileName: UserConfig.sedcard.prefix + (this.data.details.firstname || res).replace(' ', '_') + '.pdf', mimeType: 'pdf' });
    });
  }
  downloadDocument(doc: any) {
    if (doc?.mime.includes('pdf')) {
      this.dialog.open(PreviewDownloadPopupComponent, {
        data: {
          pdf: doc
        },
        disableClose: true
      });
    }
    else if (doc?.mime.includes('image')) {
      this.dialog.open(PreviewDownloadPopupComponent, {
        data: {
          image: doc
        },
        disableClose: true
      });
    }
    else {
      this.dialog.open(PreviewDownloadPopupComponent, {
        data: {
          pdf: doc
        },
        disableClose: true
      });
    }

  }
  updateRating(data: any) {
    this.usersService.updateRating(this.data.details.id, data).subscribe(res => {
      this.toastrService.success(this.translateService.instant('notification.post.ratings.success'));
      const rating = res && res.body && res.body.data ? res.body.data : null;
      // collection.datify(rating, ['created_at', 'updated_at']);
      rating.creator = rating.creator && rating.creator.data;
      this.data.rating = rating;
      // recalculate in place overall
      // this.data.details.avg_rating = collection.average(vm.data.ratings.concat(rating), 'rate');

      this.data.details.avg_rating = (data.ratings && data.ratings.length && data.ratings.reduce((a: any, b: any) => {
        return a.rate + b.rate;
      }, 0) / data.ratings.length) || undefined;
    });
    // administrationUsersService.updateRating(vm.data.details.id, data).then(function (resp) {
    //   var rating = resp[0].data;
    //   collection.datify(rating, ['created_at', 'updated_at']);
    //   rating.creator = rating.creator && rating.creator.data;
    //   vm.data.rating = rating;
    //   // recalculate in place overall
    //   vm.data.details.avg_rating = collection.average(vm.data.ratings.concat(rating), 'rate');
    // });
  }
}
