import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    nombre: string;
    email: string;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer2,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.getSiglasNombre();
    }

    toggleSidebar(e) {
        e.preventDefault();
        this.document.body.classList.toggle('sidebar-open');
    }

    onLogout(e) {
        e.preventDefault();
        localStorage.removeItem('session');
        localStorage.removeItem('isLoggedin');

        if (!localStorage.getItem('isLoggedin') && !localStorage.getItem('session')) {
            window.location.href = "https://intranet.itssolutions.co/";
            //this.router.navigate(['/auth/login']);
        }
    }

    getSiglasNombre() {
        let session = localStorage.getItem("session");
        session = JSON.parse(session);
        this.nombre = session["nombre"];
        this.email = session["email"];
        let splitted: string[] = this.nombre.split(' ', 4);
        let siglas: string = '';

        splitted.forEach(string => {
            if (siglas.length < 2) {
                siglas = siglas + string.charAt(0);
            }
        });
        return siglas.toUpperCase();

    }

}
