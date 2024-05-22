import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cargo } from '../model/cargo';
import { HttpHeaderApp } from './header';

@Injectable({
  providedIn: 'root'
})
export class CargoService {

  private baseUrl =  environment.baseUrl + "/empleados/cargos";

  constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }
  
  private header = this.headers.headerPrivate();

  getCargosList(): Observable<Cargo[]> {
    return this.httpClient.get<Cargo[]>(`${this.baseUrl}`, { headers: this.header});
  }

  createCargo(cargo: Cargo): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}`, cargo, { headers: this.header});
  }
  
  getCargoById(id: number): Observable<Cargo>{
    return this.httpClient.get<any>(`${this.baseUrl}/${id}`, { headers: this.header});
  }

  updateCargo(id: number, rol: Cargo): Observable<Object>{
    return this.httpClient.put(`${this.baseUrl}/${id}`, rol, { headers: this.header});
  }

  deleteCargo(id: number): Observable<Object>{
    return this.httpClient.delete(`${this.baseUrl}/${id}`, { headers: this.header});
  }

}