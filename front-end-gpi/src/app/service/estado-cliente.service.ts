import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EstadoCliente } from '../model/estado-cliente';
import { HttpHeaderApp } from './header';

@Injectable({
  providedIn: 'root'
})
export class EstadoClienteService { 

  private baseUrl = environment.baseUrl  +"/clientes/estados";

  constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }
  
  private header = this.headers.headerPrivate();

  getEstadosList(): Observable<EstadoCliente[]> {
    return this.httpClient.get<EstadoCliente[]>(`${this.baseUrl}`, { headers: this.header});
  }
  
}
