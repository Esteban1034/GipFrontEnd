import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ObservedValueOf } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Causas } from '../model/causas';
import { HttpHeaderApp } from './header';

@Injectable({
  providedIn: 'root'
})
export class CausasService {

  private baseUrl = environment.baseUrl + "/empleados/causas";

  constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }
  
  private header = this.headers.headerPrivate();

  getCausaList(): Observable<Causas[]> {
    return this.httpClient.get<Causas[]>(`${this.baseUrl}`, { headers: this.header});
  }

  createCausa(causa: Causas): Observable<Object> {
      return this.httpClient.post(`${this.baseUrl}`, causa, { headers: this.header});
  }

  getCausaById(id:number): Observable<Causas>{
      return this.httpClient.get<Causas>(`${this.baseUrl}/${id}`, { headers: this.header});
  }

  updateCausa(id: number, causas: Causas): Observable<Object>{
      return this.httpClient.put(`${this.baseUrl}/${id}`, causas, { headers: this.header});
  }

  deleteCausa(id: number): Observable<Object>{
      return this.httpClient.delete(`${this.baseUrl}/${id}`, { headers: this.header});
  }

}