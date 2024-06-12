import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { RolSeg } from 'src/app/model/rol-seg';
import { EmpleadoService } from 'src/app/service/empleado.service';
import { GestionUsuariosRoles } from 'src/app/service/gestion-usuario-roles.service';


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    nombre: string;
    email: string;
    rol: RolSeg = new RolSeg();
    rolesSeg: RolSeg[] = [];
    rolId: number;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer2,
        private router: Router,
        private empleadoService: EmpleadoService,
        private gestionUsuariosRoles: GestionUsuariosRoles
    ) { }

    ngOnInit(): void {
        this.getSiglasNombre();
        this.getRol();
    }

    getRol(){
        let session = localStorage.getItem("session");
        session = JSON.parse(session);
        let id = session["id"];
        this.empleadoService.getEmpleadoRolById(id).subscribe(data => {
            this.rolId= data.idRol;
            this.gestionUsuariosRoles.obtenerRoles().subscribe(roles => {
                this.rolesSeg = roles;
                this.rol = this.rolesSeg.find(rol => rol.rolId === this.rolId);
            }, error => console.log(error));
        }, error => {
            console.log(error);
        });
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
