import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstadoFactura } from '../Model/estado-factura';
import { environment } from 'src/environments/environment';
import { HttpHeaderApp } from './header';

@Injectable({
  providedIn: 'root'
})
export class EstadoFacturaService {

  private baseUrl = environment.baseUrl + '/proyectos/facturacion/estados';

  constructor(private HttpClient: HttpClient, private headers: HttpHeaderApp) { }
  
  private header = this.headers.headerPrivate();
  
  getEstadosList(): Observable<EstadoFactura[]>{
    return this.HttpClient.get<EstadoFactura[]>(`${this.baseUrl}`, { headers: this.header});
  }

  createEstado(estado: EstadoFactura): Observable<Object>{
    return this.HttpClient.post(`${this.baseUrl}`,estado, { headers: this.header});
  }

  getEstadoById(id: number): Observable<EstadoFactura>{
    return this.HttpClient.get<EstadoFactura>(`${this.baseUrl}/${id}`, { headers: this.header});
  }

  updateEstado(id: number, estado: EstadoFactura): Observable<Object>{
    return this.HttpClient.put(`${this.baseUrl}/${id}`, estado, { headers: this.header});
  }

  deleteEstado(id: number): Observable<Object>{
    return this.HttpClient.delete(`${this.baseUrl}/${id}`, { headers: this.header});
  }
   
}
