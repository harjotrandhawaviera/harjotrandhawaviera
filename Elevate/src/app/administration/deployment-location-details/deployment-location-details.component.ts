import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {AdministrationFacade} from '../+state/administration.facade';
import {OptionVM} from '../../model/option.model';
import {Observable, of} from 'rxjs';
import {AdministrationModelSearchVM} from '../../model/administartion.model';
import {FileExportService} from '../../services/file-export.service';
import {TranslateService} from '../../services/translate.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ReasonBoxComponent} from "../../core/reason-box/reason-box.component";
import {MatDialog} from "@angular/material/dialog";
import {PropertyWrite} from "@angular/compiler";

@Component({
  selector: 'app-deployment-loaction-details',
  templateUrl: './deployment-location-details.component.html',
  styleUrls: ['./deployment-location-details.component.scss']
})
export class DeploymentLocationDetailsComponent implements OnInit {
  deployment = new FormGroup({
    client_id: new FormControl('', [Validators.required]),
    contact_id: new FormControl('', [Validators.required]),
    description: new FormControl(),
    data: new FormControl()
  });
  show = false;
  id = '';
  displayedColumns = [
    'name',
    'contactName',
    'client_site_remarks',
    'action'
  ];
  paramId: any;
  deploymentdetails: OptionVM | any;
  Customer: OptionVM | any;
  Client: OptionVM | any;
  ClientData: OptionVM | any;
  contactData: OptionVM | any;
  customer: any;
  paginator: any;
  loading$: Observable<boolean> = of(false);
  searchModel: AdministrationModelSearchVM = {};

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              private administrationFacade: AdministrationFacade,
              private fileExportService: FileExportService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      // @ts-ignore
      this.paramId = +params.get('id');
    });
    this.administrationFacade.deploymentDetail(this.paramId);
    this.administrationFacade.getDeploymentDetails$.subscribe((res: any) => {
      if (res?.data) {
        this.deploymentdetails = {
          name: res?.data?.name,
          num: res?.data?.number,
          group: res?.data?.group,
          cat: res?.data?.category,
          Aaddress: res?.data?.addressaddition,
          city: res?.data?.city,
          country: res?.data?.country,
          SH: res?.data?.address,
          PC: res?.data?.postcode,
          phone: res?.data?.phone,
          email: res?.data?.email,
          fax: res?.data?.fax,
          zip: res?.data?.zip,
          zip_min: res?.data?.zip_min,
          zip_max: res?.data?.zip_max,
          firstname: res?.data?.contact?.data?.firstname,
          lastname: res?.data?.contact?.data?.lastname,
          position: res?.data?.contact?.data?.position,
          department: res?.data?.contact?.data?.department,
          clientemail: res?.data?.contact?.data?.email,
          clientphone: res?.data?.contact?.data?.phone,
          data: res?.data?.contact?.data?.data,
        };
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
    this.translateService.get('administration.users.fields.salutation').subscribe(() => {
    this.administrationFacade.getClientList$.subscribe((res: any) => {
      this.ClientData = this.sortOption(
        res.data
          ? res.data.map((a: any) => {
            return {
              name: a?.name,
              contactSalutation: this.translateService.instant('administration.users.fields.salutation.' + a?.client_site_contact?.data?.gender),
              contactName: a?.client_site_contact?.data?.firstname + ' ' + a?.client_site_contact?.data?.lastname,
              contactPosition: a?.client_site_contact?.data?.position,
              contactDepartment: a?.client_site_contact?.data?.department,
              contactEmail: a?.client_site_contact?.data?.email,
              contactPhone: a?.client_site_contact?.data?.phone,
              client_site_remarks: a?.client_site_contact?.data?.client_site_remarks,
              client_site_data: JSON.stringify(a?.client_site_data),
            };
          })
          : []
      );
    });
    });
    this.administrationFacade.getDeploymentClientDetails$.subscribe((res: any) => {
      if (res?.data) {
        this.contactData = this.sortOption(
          res?.data
          ? res.data.contacts.data.map((a: any) => {
            return {
              value: a?.id,
              text: a?.firstname + ' ' + a?.lastname,
            };
            })
            : []
        );
      }
    });
  }

  addfield() {
    this.show = !this.show;
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
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    });
  }

  saveDetails(lists: any) {
    if (this.deployment.valid) {
      const object = {
        client_id: lists?.client_id.id,
        contact_id: lists?.contact_id,
        description: lists?.description,
        data: lists?.data
      };
      this.administrationFacade.updateFieldClient(Number(this.paramId), object);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  Edata(id: any) {
    this.administrationFacade.loadEditDeployData(id);
  }
  pageChange(event: any) {
    const update = {
      ...this.searchModel,
      pageSize: event.pageSize,
      pageIndex: event.pageIndex + 1,
    };
  }

  d() {
    this.administrationFacade.deploymentClientDetail(this.deployment.value.client_id.id);
  }

  // tslint:disable-next-line:typedef

  sortOption(options: OptionVM[]) {
    return options.sort((a: OptionVM, b: OptionVM) =>
      a.text && b.text ? (a.text > b.text ? 1 : b.text > a.text ? -1 : 0) : 0
    );
  }
  downloadList() {
    const fieldNames = Object.keys(this.ClientData[0]).map((a) =>
      this.translateService.instant('administration.site-clients.table.' + a)
    );
    this.fileExportService.downloadCSV({ data: this.ClientData, filePrefix: 'administration_site-clients_tab', headerFields: fieldNames });
  }
}
