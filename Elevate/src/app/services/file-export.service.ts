import * as moment from 'moment';

import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { saveAs as importedSaveAs } from 'file-saver';

declare let navigator;

@Injectable()
export class FileExportService {
  constructor(private http: HttpClient) { }
  downloadCSV(data: {
    headerFields: string[];
    data: any[];
    filePrefix: string;
  }) {
    const json: any = data.data;
    const fields = Object.keys(json[0]);
    const csv = json.map((row: any) => fields
      .map((fieldName: string) => JSON.stringify(row[fieldName], (key: string, value: any) => {
        if (typeof value !== 'string') {
          return (value || '').toString().replace('"', '""');
        }
        return value === null ? '' : value?.replace('"', '""');
      }))
      .join(','));
    csv.unshift(data.headerFields.join(',')); // add header column
    this.downloadCSVContent(csv.join('\r\n'), data.filePrefix);
  }

  downloadCSVContent(csv: string, filePrefix: string) {
    const fileName =
      filePrefix +
      `_${moment().format('YYYY-MM-DD')}_${moment()
        .format('hh:mm:ss')
        .replace(':', '_')}.csv`;
    const universalBOM = '\uFEFF';
    const url =
      'data:text/csv; charset=utf-8,' + encodeURIComponent(universalBOM + csv);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, fileName);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        // Browsers that support HTML5 download attribute
        // const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
  downloadBlobContent(blob: string, fileName: string, mimeType: string) {

    const universalBOM = '\uFEFF';
    const url =
      `data:${mimeType},` + encodeURIComponent(universalBOM + blob);
    // const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, fileName);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        // Browsers that support HTML5 download attribute
        // const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
  getDownload(req: { url: string; fileName: string; mimeType: string }) {
    let customHeaders = new HttpHeaders();
    customHeaders = customHeaders.append('Content-Type', req.mimeType);
    customHeaders = customHeaders.append('Accept', '*/*');

    this.http
      .get(req.url, {
        observe: 'events',
        responseType: 'blob',
        headers: customHeaders,
        reportProgress: true,
      })
      .subscribe((res) => {
        if (res.type === HttpEventType.Response) {
          // const resType =
          //   res.headers.get('Content-Type') || 'text/csv;charset=UTF-8';
          if (res.body && res.body.size) {
            if (req.mimeType.indexOf('csv') !== -1) {
              const reader = new FileReader();
              reader.onload = (e) => {
                this.downloadCSVContent(reader.result as string, req.fileName);
              };
              reader.readAsText(res.body);
            } else {
              const contentType = req.mimeType || (res.headers && res.headers.get('content-type') || undefined);
              const blob: Blob = new Blob([res.body], {
                type: contentType
              });
              importedSaveAs(blob, req.fileName, { autoBom: false });
            }
          }
        }
      });
  }
}
