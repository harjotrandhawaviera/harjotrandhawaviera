import { HttpClient } from '@angular/common/http';
import { IdRequestVM } from './../model/search.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchRequestVM } from '../model/search.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  query(path: string, params: string[], data: any): string {
    const delimiter = path.match(/\?/) ? '&' : '?';
    return (
      path +
      delimiter +
      params
        .filter((a: string) => data[a])
        .map((item: any) => {
          return item + '=' + data[item];
        })
        .join('&')
    );
  }
  /**
   * transform only parameter to string
   * @param {string|array|object} only
   * @return {string}
   */
  transformOnly(only: any) {
    if (typeof only === 'object' && !Array.isArray(only)) {
      let res: string[] = [];
      for (const key in only) {
        if (Object.prototype.hasOwnProperty.call(only, key)) {
          if (Array.isArray(only[key])) {
            res = res.concat(
              only[key].map((prop: string) => {
                return key + '.' + prop;
              })
            );
          }
        }
      }
      return res.join(',');
    } else {
      return Array.isArray(only) ? only.join(',') : only;
    }
  }
  /**
   * Transforms given path replacing {keys} within data properties
   *
   * @param {string} path
   * @param {object} data
   * @param {string|array} only
   * @returns {string}
   */
  transformPath(path: string, data: any, only?: string | string[]) {
    const params = path.match(/{\w+}/g);
    const delimiter = path.match(/\?/) ? '&' : '?';

    if (params && !data) {
      console.error('Data required for path ' + path);
      return;
    }
    params?.forEach((param) => {
      const property = param.substring(1, param.length - 1);
      let value = data[property];

      if (!value) {
        console.error('Property ' + property + ' missing for path ' + path);
        value = '';
      }
      path = path.replace(param, value);
      delete data[property];
    });

    if (only) {
      path = path + delimiter + 'only_fields=' + this.transformOnly(only);
    }
    return path;
  }
  appendQueryString(url: string, name: string, value: any): string {
    return (
      url + `${url && url.indexOf('?') !== -1 ? '&' : '?'}${name}=${value}`
    );
  }
  getSearchURL(url: string, searchRequest: SearchRequestVM): string {
    let newURL = url;
    if (searchRequest.limit) {
      newURL = this.appendQueryString(newURL, 'limit', searchRequest.limit);
    }
    if (searchRequest.sort_by_column) {
      newURL = this.appendQueryString(
        newURL,
        'sort_by_column',
        searchRequest.sort_by_column
      );
    }
    /*if (searchRequest) {
      newURL = this.appendQueryString(
        newURL,
        'sort_by_column',
        searchRequest.sort_by_column
      );
    }*/
    if (searchRequest.include && searchRequest.include.length > 0) {
      newURL = this.appendQueryString(
        newURL,
        'include',
        searchRequest.include.join()
      );
    }
    if (searchRequest.only_fields?.length) {
      newURL = this.appendQueryString(
        newURL,
        'only_fields',
        searchRequest.only_fields.join()
      );
    }
    if (searchRequest.filters?.length) {
      searchRequest.filters.forEach((fil) => {
        newURL = this.appendQueryString(newURL, fil.key, fil.value);
      });
    }
    if (searchRequest.order_by) {
      newURL = this.appendQueryString(
        newURL,
        'order_by',
        searchRequest.order_by
      );
    }
    if (searchRequest.order_dir) {
      newURL = this.appendQueryString(
        newURL,
        'order_dir',
        searchRequest.order_dir
      );
    }
    if (searchRequest.page !== null && searchRequest.page !== undefined) {
      newURL = this.appendQueryString(newURL, 'page', searchRequest.page);
    }
    return newURL;
  }
  getByIdURL(endPoint: string, searchRequest: IdRequestVM): string {
    let newURL = `${endPoint}/${searchRequest.id}`;
    if (searchRequest.limit) {
      newURL = this.appendQueryString(newURL, 'limit', searchRequest.limit);
    }
    if (searchRequest.include?.length) {
      newURL = this.appendQueryString(
        newURL,
        'include',
        searchRequest.include.join()
      );
    }
    if (searchRequest.filters?.length) {
      searchRequest.filters.forEach((fil) => {
        newURL = this.appendQueryString(newURL, fil.key, fil.value);
      });
    }
    if (searchRequest.order_by) {
      newURL = this.appendQueryString(
        newURL,
        'order_by',
        searchRequest.order_by
      );
    }
    if (searchRequest.order_dir) {
      newURL = this.appendQueryString(
        newURL,
        'order_dir',
        searchRequest.order_dir
      );
    }
    if (searchRequest.page !== null && searchRequest.page !== undefined) {
      newURL = this.appendQueryString(newURL, 'page', searchRequest.page);
    }
    return newURL;
  }
}
