import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Rol } from '../model/rol';
import { HttpHeaderApp } from './header';

@Injectable({
  providedIn: 'root'
})
export class RolService {

    private baseUrl = environment.baseUrl + '/usuarios/roles';


    constructor(private httpClient: HttpClient, 
        private headers: HttpHeaderApp) { }
  
    private header = this.headers.headerPrivate();

    findAll(): Observable<Rol[]> {
        return this.httpClient.get<Rol[]>(`${this.baseUrl}`, { headers: this.header});
    }
}
