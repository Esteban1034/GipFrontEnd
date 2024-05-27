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
    providedIn: 'root'
})
export class MenuService {


    private baseUrl = environment.baseUrl + "/menu";

    constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }

    private header = this.headers.headerPrivate();


    getMenu(idEmpleado: number): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}/consultarMenu/${idEmpleado}`)
    }

}
