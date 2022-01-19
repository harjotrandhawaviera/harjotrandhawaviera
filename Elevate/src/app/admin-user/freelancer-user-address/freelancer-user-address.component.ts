import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable, of } from 'rxjs';

import { MapConfig } from './../../constant/map.constant';
import { MapGeocoder } from '@angular/google-maps';
import { MapService } from '../../services/map.service';

@Component({
  selector: '[app-freelancer-user-address]',
  templateUrl: './freelancer-user-address.component.html',
  styleUrls: ['./freelancer-user-address.component.scss']
})
export class FreelancerUserAddressComponent implements OnChanges {
  @Input()
  data: any = {}
  @Input()
  mapLoaded = false;
  applicationArea: any = ''
  map: any = undefined;
  mapZoom = MapConfig.profileAddress.zoom;
  areaRadius = MapConfig.profileAddress.area.radius;

  constructor(private geocoder: MapGeocoder) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.data && this.data.city && this.data.country && this.mapLoaded) {
      var address = this.data.city + ' ' + this.data.country;
      console.log(address, 'address')
      this.geocoder.geocode({address: address}).subscribe((res) => {
        if (res && res.results.length > 0 && res.status === google.maps.GeocoderStatus.OK) {
          const center = { lat: res.results[0].geometry.location.lat(), lng: res.results[0].geometry.location.lng() };
          this.map = {
            center: center,
            zoom: this.mapZoom
          };
          this.applicationArea = {
            strokeColor: MapConfig.profileAddress.area.style.color,
            strokeOpacity: MapConfig.profileAddress.area.style.opacity,
            fillColor: MapConfig.profileAddress.area.style.color,
            fillOpacity: MapConfig.profileAddress.area.style.opacity,
            fill: MapConfig.profileAddress.area.style,
            center: center,
            radius: this.areaRadius * 1000 // in metres
          };
        }
      });
    }
  }
}
