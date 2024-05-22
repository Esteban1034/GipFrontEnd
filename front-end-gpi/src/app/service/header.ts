import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HttpHeaderApp {

    constructor() { }
    
    public headerPublic = new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Authorization': ''
    });

    public headerPrivate(): any {
        let session = localStorage.getItem('session');
        let token = '';
        let type_token = '';
        if (session) {
            session = JSON.parse(session);
            token = session["token"];
            type_token = session["bearer"];
        }
        const headerPrivate = new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Authorization': type_token + ' ' + token
        });
        if (token !== '' && type_token !== '') {
            return headerPrivate;
        } else {
            return null;
        }
    }
}