import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators'
import { Observable, of, throwError } from 'rxjs';
import { HttpHeaderApp } from './header';
import { environment } from "src/environments/environment";

import { Usuario } from '../model/usuario';
import { Submenu } from '../model/submenu';
import { RolSeg } from '../model/rol-seg';



@Injectable({
    providedIn:'root'
})
export class GestionUsuariosRoles{


    private baseUrl = environment.baseUrl + "/gestionUsuariosRoles";

    constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }

    private header = this.headers.headerPrivate();

    public obtenerRoles(): Observable<RolSeg[]>{
        return this.httpClient.get<RolSeg[]>(`${this.baseUrl}/listarRoles`);
    }


    registrarUsuario(usuario:Usuario): Observable<any> {
        return this.httpClient.post<any>(`${this.baseUrl}/crearUsuario`,usuario,{ headers: this.header })
      }


    listarMenuOpciones(): Observable<Submenu[]> {
        return this.httpClient.get<Submenu[]>(`${this.baseUrl}/listarMenu`,{ headers: this.header })
      }


      registrarRol(rol:RolSeg): Observable<any> {
        return this.httpClient.post<any>(`${this.baseUrl}/crearRol`,rol,{ headers: this.header })
      }


      listarUsuarios(): Observable<Usuario[]> {
        return this.httpClient.get<Usuario[]>(`${this.baseUrl}/listarUsuarios`,{ headers: this.header })
      }

}
