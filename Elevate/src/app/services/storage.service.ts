import { Injectable } from '@angular/core';
import { StorageKeys } from '../constant/storage.constant';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() { }
  public set(key: StorageKeys, value: string) {
    localStorage.setItem(key, value);
  }
  public get(key: StorageKeys): string | null {
    return localStorage.getItem(key);
  }
  public clear(key: StorageKeys) {
    localStorage.removeItem(key);
  }
  public clearAll() {
    localStorage.clear();
  }
}
