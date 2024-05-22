import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SectorCliente } from '../model/sector-cliente';
import { HttpHeaderApp } from './header';

@Injectable({
  providedIn: 'root'
})
export class SectorClienteService {

  private baseUrl = environment.baseUrl + "/clientes/sectores";

  constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }
  
  private header = this.headers.headerPrivate();

  getSectoresList(): Observable<SectorCliente[]> {
    return this.httpClient.get<SectorCliente[]>(`${this.baseUrl}`, { headers: this.header});
  }

}
