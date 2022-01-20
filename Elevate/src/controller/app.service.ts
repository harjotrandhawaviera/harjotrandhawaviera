import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  searchContainer= {
    opened: false
  };

  constructor() { }
}
