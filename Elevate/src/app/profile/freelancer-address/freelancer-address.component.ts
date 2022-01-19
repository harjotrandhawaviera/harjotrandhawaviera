import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { A } from '@angular/cdk/keycodes';
import { FormConfig } from './../../constant/forms.constant';
import { FormGroup } from '@angular/forms';
import { OptionVM } from './../../model/option.model';
import { TranslateService } from './../../services/translate.service';

@Component({
  selector: 'app-freelancer-address',
  templateUrl: './freelancer-address.component.html',
  styleUrls: ['./freelancer-address.component.scss'],
})
export class FreelancerAddressComponent implements OnInit {
  @Input()
  addressGroup: FormGroup | undefined;
  @Input()
  displayMessage: any = {};
  countryLK: OptionVM[] = [];
  @ViewChild('locality') locality: any;
  @ViewChild('near_to_city')
  near_to_city!: ElementRef;
  addressClassList = [];
  streetName: any;
  isLocationSelected: boolean = false;
  constructor(private translateService: TranslateService, private el : ElementRef) { }

  ngOnInit(): void {
  
    this.translateService.get('country').subscribe(res => {
      this.countryLK = FormConfig.master.countries.map(a => {
        return {
          value: res[a],
          text: res[a]
        }
      });
    });
    if(this.addressGroup?.controls.locality.value != '' || this.addressGroup?.controls.locality.value != null){
      this.isLocationSelected = true;
    }
  }
  onSearchChange(){
    const autocomplete = new google.maps.places.Autocomplete(this.locality.nativeElement,
      {
          types: ['geocode']  
      });
  google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      let city:any;
    var address: any = place;
    this.isLocationSelected = true;
     address?.address_components.forEach((val: any) => {
       if(val.types.length>1){
        if(val.types[0]=="administrative_area_level_2"){
          this.addressGroup?.controls.city.setValue(val.long_name)     
        }
        if(val.types[0]=="administrative_area_level_1"){
               city = val.long_name
        }
        if(val.types[0]=="locality"){
          this.addressGroup?.controls.locality.setValue(address?.address_components[0].long_name)  
        }
        if(val.types[0]=="country"){
          this.addressGroup?.controls.country.setValue(val.long_name)
          this.addressGroup?.controls.locality_lat && this.addressGroup?.controls.locality_lat.setValue(`${address.geometry.location.lat()}`)
          this.addressGroup?.controls.locality_lng && this.addressGroup?.controls.locality_lng.setValue(`${address.geometry.location.lng()}`)     
        }
       }
       if(val.types[0]=="postal_code"){
        this.addressGroup?.controls.zip.setValue(val.long_name)     
      }
      if(this.addressGroup?.controls.city.value == '' || this.addressGroup?.controls.city.value == null){
        this.addressGroup?.controls.city.setValue(city);
      }
     this.addressClassList.forEach((val: any) => {
      if(val == "primary-address"){
      let nearToCities: any =  document.getElementsByClassName("near_to_city");
      nearToCities[0]?.click()
      }
      if(val == "secondary-address"){
        let nearToCities: any =  document.getElementsByClassName("near_to_city");
        nearToCities[1]?.click()
        }
    })
    })
    });
  }
  getSelectedAddressClass(event:any){
    this.isLocationSelected = false;
    if(this.addressGroup?.controls.country.value != null){
    this.streetName = this.addressGroup?.controls.address.value;
      this.addressGroup?.reset();
      if(this.streetName != '' && this.streetName != null){
        this.addressGroup?.controls.address.setValue(this.streetName);
      }
    }
   this.addressClassList = event.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.classList
  }
}
