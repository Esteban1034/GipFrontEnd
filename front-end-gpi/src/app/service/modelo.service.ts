import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Modelo } from '../Model/modelo';
import { HttpHeaderApp } from './header';

@Injectable({
    providedIn: 'root'
  })
  export class ModeloService {

    private baseUrl = environment.baseUrl + "/Modelo";

    constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }
    
    private header = this.headers.headerPrivate();

    getAllModelos(): Observable<Modelo[]> {
        return this.httpClient.get<Modelo[]>(`${this.baseUrl}`, { headers: this.header});
      }

  }