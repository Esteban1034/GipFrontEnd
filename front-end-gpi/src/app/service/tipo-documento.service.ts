import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoDocumento } from '../model/tipo-documento';
import { HttpHeaderApp } from './header';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {

  private baseUrl = environment.baseUrl + "/empleados/tipos-documento";

  constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }
  
  private header = this.headers.headerPrivate();

  getTiposList(): Observable<TipoDocumento[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}`, { headers: this.header});
  }

}