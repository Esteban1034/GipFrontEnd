import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Proyecto } from 'src/app/Model/proyecto';
import { ProyectoService } from 'src/app/service/proyecto.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-list-proyectos-int',
    templateUrl: './list-proyectos-int.component.html',
    styleUrls: ['./list-proyectos-int.component.scss']
})
export class ListProyectosIntComponent implements OnInit {

    idToDelete:number = undefined;
    proyectos:Proyecto[] = [];

    modalEliminarProyecto:NgbModalRef;

    constructor(private proyectoService:ProyectoService,
        private router:Router,
        private modalService:NgbModal,
        private toastr:ToastrService) { }
    
    session = localStorage.getItem('session');
    
    ngOnInit(): void {
        this.session = JSON.parse(this.session);
        this.getProyectos();
    }

    getProyectos() {
        this.proyectoService.getProyectosList().subscribe(data => {
            this.proyectos = [];
            data.forEach(proyecto => {
                if(proyecto.interno) {
                    this.proyectos.push(proyecto);
                }
            });
        }, error => {
            console.log(error);
        });
    }

    editar(idProyecto:number) {
        this.router.navigate(['proyectos/internos/editar/', idProyecto]);
    }

    openEliminarModal(content, id:number) {
        this.idToDelete = id;
        this.modalEliminarProyecto = this.modalService.open(content);
    }

    eliminar() {
        this.proyectoService.deleteProyectoInt(this.idToDelete).subscribe(data => {
            console.log(data);
            this.toastr.warning('Proyecto eliminado correctamente.');
            this.modalService.dismissAll();
            this.getProyectos();
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
        });
    }

}
