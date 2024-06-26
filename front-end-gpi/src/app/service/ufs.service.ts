import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaderApp } from 'src/app/service/header';
import { Ufs } from '../model/ufs';

@Injectable({
  providedIn: 'root'
})
export class UsfService {

  private baseUrl = environment.baseUrl + "/unidad-funcional";

  constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }

  private header = this.headers.headerPrivate();

  getUfs(): Observable<Ufs[]> {
    return this.httpClient.get<Ufs[]>(`${this.baseUrl}`, { headers: this.header});
  }


}
