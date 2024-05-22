import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaderApp } from './header';
import { Observable } from 'rxjs';
import { Proyecto } from '../Model/proyecto';
import { Session } from 'protractor';

@Injectable({
    providedIn: 'root'
})
export class MailService {

    private baseUrl = environment.baseUrl + '/mail/proyecto';

    constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }
  
    private header = this.headers.headerPrivate();

    sendSimpleMail(sendTo:string, subject:string, proyecto:Proyecto):Observable<Object> {

        return this.httpClient.post(`${this.baseUrl}/send/${sendTo}/${subject}`,proyecto, {headers: this.header});
    }

    sendMail(proyecto: Proyecto, idCreator:number): Observable<Object>{
        return this.httpClient.post(`${this.baseUrl}/${idCreator}`, proyecto,{headers: this.header});
      }
    

}
