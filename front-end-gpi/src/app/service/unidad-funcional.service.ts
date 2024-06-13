import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpHeaderApp } from "./header";
import { Ufs } from "../model/ufs";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
  })
  export class UnidadFuncionalService {

    private baseUrl = environment.baseUrl + "/unidad-funcional"

    constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }

    private header = this.headers.headerPrivate();

    getUnidadFuncional():Observable<Ufs[]>{
        return this.httpClient.get<Ufs[]>(`${this.baseUrl}`, {headers: this.header});
    }

    createUnidadFuncional(ufs: any):Observable<Object>{
        ufs.fechaCreacion = new Date();
        return this.httpClient.post(`${this.baseUrl}`, {headers: this.header})
    }

    updateUnidadFuncional(id: number, ufs: Ufs):Observable<Object>{
        return this.httpClient.put(`${this.baseUrl}/${id}`, ufs, {headers: this.header} )
    }

    getUnidadFuncionalById(id: number):Observable<Ufs>{
        return this.httpClient.get<Ufs>(`${this.baseUrl}/${id}`, {headers: this.header})
    }

    deleteUnidadFuncional(id: number):Observable<Object>{
        return this.httpClient.delete(`${this.baseUrl}/${id}`, {headers: this.header})
    }
  }