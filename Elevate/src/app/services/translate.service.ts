import { Observable, concat, defer, forkJoin, isObservable, of } from 'rxjs';
import { TranslateDefaultParser, TranslateParser } from './translate.parser';
import { concatMap, map, shareReplay, switchMap, take } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { isDefined } from '../utility/util';

@Injectable()
export class TranslateService {
  private loadingTranslations: { [key: string]: Observable<any> } = {};
  private pending: boolean = false;
  private pendingModules: string[] = [];
  language: string = environment.defaultLanguage;
  private _translations: any = {};
  private folderPath = './lang/';
  get translations(): any {
    return this._translations;
  }
  set translations(translations: any) {
    this._translations = translations;
  }
  moduleMapping: { [key: string]: string } = {
    page: 'root',
    cookie: 'root',
    auth: 'root',
    user: 'root',
    form: 'root',
    buttons: 'root',
    training: 'root',
    exams: 'root',
    dashboard: 'root',
    upload: 'root',
    notification: 'root',
    rights: 'root',
    maintenance: 'root',
    incentives: 'root',
    jobs: 'jobs',
    job: 'jobs',
    dates: 'jobs',
    date: 'jobs',
    assignments: 'jobs',
    checkins: 'jobs',
    assignment: 'jobs',
    freelancers: 'administration',
    contract_types: 'contracts',
    revenues: 'revenues',
    revenue: 'revenues',
  };
  constructor(public parser: TranslateDefaultParser, private http: HttpClient) {
    let language = localStorage.getItem('language');
    if (!language) {
      language = environment.defaultLanguage;
      localStorage.setItem('language', language);
    }
    this.language = language;
    this.translations = {
      [this.language]: {},
    };
  }
  /**
   * Returns the parsed result of the translations
   */
  public getParsedResult(
    translations: any,
    key: string,
    interpolateParams?: Object
  ): any {
    let res: string | Observable<string> = '';

    // if (key instanceof Array) {
    //   let result: any = {},
    //     observables: boolean = false;
    //   for (let k of key) {
    //     result[k] = this.getParsedResult(translations, k, interpolateParams);
    //     if (isObservable(result[k])) {
    //       observables = true;
    //     }
    //   }
    //   if (observables) {
    //     const sources = key.map((k) =>
    //       isObservable(result[k]) ? result[k] : of(result[k] as string)
    //     );
    //     return forkJoin(sources).pipe(
    //       map((arr: Array<any>) => {
    //         let obj: any = {};
    //         arr.forEach((value: string, index: number) => {
    //           obj[key[index]] = value;
    //         });
    //         return obj;
    //       })
    //     );
    //   }
    //   return result;
    // }

    if (translations) {
      res = this.parser.interpolate(
        this.parser.getValue(translations, key),
        interpolateParams
      );
    }

    if (typeof res === 'undefined' && this.language) {
      res = this.parser.interpolate(
        this.parser.getValue(this.translations[this.language], key),
        interpolateParams
      );
    }

    // if (typeof res === "undefined") {
    //   let params: MissingTranslationHandlerParams = {key, translateService: this};
    //   if (typeof interpolateParams !== 'undefined') {
    //     params.interpolateParams = interpolateParams;
    //   }
    //   res = this.missingTranslationHandler.handle(params);
    // }

    return typeof res !== 'undefined' ? res : key;
  }
  /**
   * Gets an object of translations for a given language with the current loader
   * and passes it through the compiler
   */
  public getTranslation(module: string): Observable<any> {
    this.pending = true;
    this.pendingModules.push(module);
    const loadingTranslations = this.http
      .get(
        `${this.folderPath}${module === 'root' ? '' : module + '.'}${
          this.language
        }.json`
      )
      .pipe(shareReplay(1), take(1));
    this.loadingTranslations[module] = loadingTranslations;
    // this.loadingTranslations = loadingTranslations.pipe(
    //   map((res: Object) => this.compiler.compileTranslations(res, lang)),
    //   shareReplay(1),
    //   take(1)
    // );

    this.loadingTranslations[module].subscribe({
      next: (res: Object) => {
        this.translations[this.language] = {
          ...this.translations[this.language],
          ...res,
        };
        // this.updateLangs();
        this.pending = false;
        this.pendingModules = this.pendingModules.filter((a) => a !== module);
      },
      error: (err: any) => {
        this.pending = false;
        this.pendingModules = this.pendingModules.filter((a) => a !== module);
      },
    });

    return loadingTranslations;
  }
  isPending(module: string) {
    return this.pendingModules.findIndex((a) => a === module) !== -1;
  }
  get(key: string, interpolateParams?: Object): Observable<string | any> {
    if (!isDefined(key) && key.indexOf('.') !== -1) {
      throw new Error(`Parameter "key" required`);
    }
    // check if we are loading a new translation to use
    let module = key.split('.')[0];
    module = this.moduleMapping[module] || module;
    if (this.isPending(module)) {
      return this.loadingTranslations[module].pipe(
        concatMap((res: any) => {
          res = this.getParsedResult(res, key, interpolateParams);
          return isObservable(res) ? res : of(res);
        })
      );
    } else if (!this.translations[this.language][module]) {
      this.getTranslation(module);
      return this.loadingTranslations[module].pipe(
        concatMap((res: any) => {
          res = this.getParsedResult(res, key, interpolateParams);
          return isObservable(res) ? res : of(res);
        })
      );
    } else {
      let res = this.getParsedResult(
        this.translations[this.language],
        key,
        interpolateParams
      );
      return isObservable(res) ? res : of(res);
    }
  }

  /**
   * Returns a translation instantly from the internal state of loaded translation.
   * All rules regarding the current language, the preferred language of even fallback languages will be used except any promise handling.
   */
  public instant(key: string, interpolateParams?: Object): string | any {
    if (!isDefined(key) || !key.length) {
      throw new Error(`Parameter "key" required`);
    }

    let res = this.getParsedResult(
      this.translations[this.language],
      key,
      interpolateParams
    );
    if (isObservable(res)) {
      // if (key instanceof Array) {
      //   let obj: any = {};
      //   key.forEach((value: string, index: number) => {
      //     obj[key[index]] = key[index];
      //   });
      //   return obj;
      // }
      return key;
    } else {
      return res;
    }
  }
}
