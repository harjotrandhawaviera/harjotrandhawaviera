import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AdministrationFacade } from '../+state/administration.facade';
import { OptionVM } from '../../model/option.model';
import {Observable, of} from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {TranslateService} from '../../services/translate.service';
import {FormConfig} from '../../constant/forms.constant';
import {AdministrationModelSearchVM} from "../../model/administartion.model";
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {ReasonBoxComponent} from '../../core/reason-box/reason-box.component';

@Component({
  selector: 'app-deployment-edit-details',
  templateUrl: './deployment-edit-details.component.html',
  styleUrls: ['./deployment-edit-details.component.scss']
})
export class DeploymentEditDetailsComponent implements OnInit {
  @Input()
  displayMessage: any = {};
  id = '';
  cid = '';
  Nid: any;
  
  @ViewChild('locality') locality: any;

  Deploy = new FormGroup({
    name: new FormControl( '' , [ Validators.required ]),
    number: new FormControl(),
    group: new FormControl(),
    address: new FormControl('', [ Validators.required ]),
    addressaddition: new FormControl(),
    zip: new FormControl('', [ Validators.required ]),
    city: new FormControl('', [ Validators.required ]),
    option: new FormControl(),
    country: new FormControl(),
    phone: new FormControl('', [ Validators.required ]),
    fax: new FormControl(''),
    email: new FormControl(''),
    zip_min: new FormControl(),
    zip_max: new FormControl(),
    client_id: new FormControl('', Validators.required),
    contact_id: new FormControl('', Validators.required),
    description: new FormControl(),
    data: new FormControl(),
    contact: new FormGroup({
      salution: new FormControl(),
      firstname: new FormControl(),
      lastname: new FormControl(),
      position: new FormControl(),
      department: new FormControl(),
      email: new FormControl(),
      phoneno: new FormControl(),
      information: new FormControl()
    }),
    pos_lat: new FormControl(),
    pos_lng: new FormControl()
  });
  Customer: OptionVM | any;
  Client: OptionVM | any;
  paginator: any;
  categoryLk: OptionVM | any;
  clientLk: OptionVM | any;
  data: OptionVM | any;
  show = false;
  showClient = false;
  contactData: OptionVM | any;
  showContact = false;
  displayedColumns = [
    'name',
    'contactName',
    'client_site_remarks',
    'action'
  ];
  result: any = of([]);
  abc: any = of([]);
  value: any;
  paramId: any;
  customer: any;
  loading$: Observable<boolean> = of(false);
  searchModel: AdministrationModelSearchVM = {};

  constructor(private router: Router,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private administrationFacade: AdministrationFacade,
              private translateService: TranslateService,
              private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      // @ts-ignore
      this.paramId = +params.get('id');
    });
    this.administrationFacade.getEditDisplayRecord$.subscribe((res) => {
      if ('data' in res) {
        this.result = res?.data;
        this.abc = res?.data?.contact?.data;
        this.id = res?.data.id;
        this.cid = res?.data.contact_id;
        if (this.paramId) {
          this.Deploy.patchValue({
            name: this.result.name,
            number: this.result.number,
            group: this.result.group,
            category: this.result.category,
            address: this.result.address,
            addressaddition: this.result.addressaddition,
            zip: this.result.zip,
            city: this.result.city,
            country: this.result.country,
            phone: this.result.phone,
            fax: this.result.fax,
            email: this.result.email,
            zip_min: this.result.zip_min,
            zip_max: this.result.zip_max,
            firstname: this.abc?.firstname,
            lastname: this.abc?.lastname,
            position: this.abc?.position,
            department: this.abc?.department,
            phoneno: this.abc?.phone,
            pos_lat: this.result.pos_lat,
            pos_lng: this.result.pos_lng
          });
        }
      }
    });
    if (this.paramId) {
      this.administrationFacade.loadClientList(this.paramId);
      this.administrationFacade.getClientList$.subscribe((res: any) => {
        this.Client = this.sortOption(
          res.data
            ? res.data.map((a: any) => {
              return {
                id: a?.id,
                name: a?.name,
                client_site_remarks: a?.client_site_remarks,
                fullName: [a?.client_site_contact?.data?.firstname, a?.client_site_contact?.data?.lastname].join(' ')
              };
            })
            : []
        );
        this.paginator = res?.meta?.pagination;
      });
    }
    this.translateService.get('administration.site.fields.category').subscribe(() => {
    this.categoryLk = FormConfig.sites.category.map((a) => {
      return {
        value: a,
        text: this.translateService.instant(
          'administration.site.fields.category.' + a
        ),
      };
    });
    });
    this.translateService.get('administration.users.fields.salutation').subscribe(() => {
      this.clientLk = FormConfig.contact.salutation.map((a) => {
        return {
          value: a,
          text: this.translateService.instant(
            'administration.users.fields.salutation.' + a
          ),
        };
      });
    });
    this.administrationFacade.getDeploymentClientDetails$.subscribe((res: any) => {
      if (res?.data) {
        this.contactData = this.sortOption(
          res?.data
            ? res.data.contacts.data.map((a: any) => {
              return {
                value: a?.id,
                text: a?.firstname + ' ' + a?.lastname
              };
            })
            : []
        );
      }
    });
    this.administrationFacade.loadCustomer();
    this.administrationFacade.getCustomerList$.subscribe((res: any) => {
      this.Customer = this.sortOption(
        res.data
          ? res.data.map((a: any) => {
            return {
              id: a?.id,
              name: a?.name,
            };
          })
          : []
      );
    });


  }

  addfield() {
    this.showClient = !this.showClient;
  }

  addcontact() {
    this.showContact = !this.showContact;
  }

  saveData(lists: any) {
      const object = {
        client_id: lists?.client_id1.id,
        contact_id: lists?.contact_id1,
        description: lists?.description,
        data: lists?.data
      };
      this.administrationFacade.updateFieldClient(Number(this.paramId), object);
  }

  saveDetail(lists: any) {
    const object = {
      name: lists?.name,
      number:  lists?.number,
      group:  lists?.group,
      address: lists?.address,
      addressaddition:  lists?.addressaddition,
      zip:  lists?.zip,
      city:  lists?.city,
      option: lists?.option,
      country: lists?.country ,
      phone: lists?.phone,
      fax:  lists?.fax,
      email:  lists?.email,
      zip_min: lists?.zip_min ,
      zip_max:  lists?.zip_max,
      salution: lists?.salution,
      firstname: lists?.firstname,
      lastname: lists?.lastname,
      position: lists?.position,
      department: lists?.department,
      email1: lists?.email,
      phoneno: lists?.phoneno,
      information: lists?.information,
      pos_lat: lists?.pos_lat,
      pos_lng: lists?.pos_lng,
    };
    this.administrationFacade.updateDeploy(Number(this.id), object);
    this.administrationFacade.updateCDeploy(Number(this.cid), object);
    this.toastrService.success(this.translateService.instant('notification.post.sites.success'));
    this.router.navigate(['administration', 'sites']);
  }

  d() {
    this.administrationFacade.deploymentClientDetail(this.Deploy.value.client_id.id);
  }
  EditData() {
    this.administrationFacade.deploymentClientDetail(this.Deploy.value.client_id1.id);
  }

  add(lists: any) {
    const newObject = {
      name: lists?.name,
      number:  lists?.number,
      group:  lists?.group,
      address: lists?.address,
      addressaddition:  lists?.addressaddition,
      zip:  lists?.zip,
      city:  lists?.city,
      option: lists?.option,
      country: lists?.country ,
      phone: lists?.phone,
      fax:  lists?.fax,
      email:  lists?.email,
      zip_min: lists?.zip_min ,
      zip_max:  lists?.zip_max,
      salution: lists?.salution,
      firstname: lists?.firstname,
      lastname: lists?.lastname,
      position: lists?.position,
      department: lists?.department,
      email1: lists?.email,
      phoneno: lists?.phoneno,
      information: lists?.information,
      pos_lat: lists?.pos_lat,
      pos_lng: lists?.pos_lng,
    };
    this.administrationFacade.add(newObject);
    this.administrationFacade.getNewDeployData$.subscribe((res: any) => {
      if (res?.data) {
        this.Nid = res?.data?.id;
        this.toastrService.success(this.translateService.instant('notification.post.sites.success'));
        this.router.navigate(['administration', 'sites', this.Nid]);
      }
    });
  }

  open() {
    this.showClient = !this.showClient;
  }

  deleteFieldClient(row: any) {
    this.dialog.open(ReasonBoxComponent, {
      data: {
        type: 'warning',
        title: this.translateService.instant(
          'administration.site-clients.table.remove.title'
        ),
        message: this.translateService.instant(
          'administration.site-clients.table.remove.message'
        ),
        cancelCode: 'administration.client.buttons.cancel',
        confirmCode: 'todos.set-state.buttons.confirm',
      },
    }).afterClosed().subscribe(res => {
      if (res) {
        const id = this.paramId;
        const cid = row.id
        this.administrationFacade.deleteFieldClient(id, cid);
        this.administrationFacade.loadClientSearchList(this.paramId, {pageIndex: this.paginator.current_page});
      }
    });
  }

  navigateToDetail() {
    this.router.navigate(['administration', 'sites', this.paramId ]);
  }
  pageChange(event: any) {
    const update = {
      ...this.searchModel,
      pageSize: event.pageSize,
      pageIndex: event.pageIndex + 1,
    };
    this.administrationFacade.loadClientSearchList(this.paramId, update);
  }

  // tslint:disable-next-line:typedef
  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }

  onSearchChange(){
    const autocomplete = new google.maps.places.Autocomplete(this.locality.nativeElement,
      {
          types: ['geocode']
      });
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place: any = autocomplete.getPlace();
      this.Deploy?.controls.address.patchValue(place.formatted_address);
      this.Deploy?.controls.pos_lat.patchValue(`${place.geometry.location.lat()}`);
      this.Deploy?.controls.pos_lng.patchValue(`${place.geometry.location.lng()}`);
    });
  }
}
