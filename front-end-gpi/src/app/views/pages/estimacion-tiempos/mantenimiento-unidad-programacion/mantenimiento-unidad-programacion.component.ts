import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { MantenimientoUnidad } from 'src/app/model/mantenimiento-unidad';
import { MantenimientoUnidadService } from 'src/app/service/mantenimiento-unidad-service';


@Component({
    selector: 'app-mantenimiento-unidad-programacion',
    templateUrl: './mantenimiento-unidad-programacion.component.html',
    styleUrls: ['./mantenimiento-unidad-programacion.component.scss']
})
export class Mantenimiento_unidadprogramacion implements OnInit {
    validador: boolean = true; 
    validadorBuscar: boolean = true;
    unidadNueva: MantenimientoUnidad = new MantenimientoUnidad();
    pesos: number[] = [1,2,3,4,5,6,7,8,9,10,22,34,53,23];
    mantenimientosUnidad: MantenimientoUnidad[] = [];
    peso: number = 0;
    nombreUnidad: string = "";

    constructor(private mantenimientoUnidadServ: MantenimientoUnidadService) { }

    ngOnInit(): void {
        this.mantenimientoUnidadServ.getMantenimientos().subscribe(data =>{
            this.mantenimientosUnidad = data;
        });
    }

    crearUnidad(){
        this.validador = true;
        this.validadorBuscar = true;
    }

    visualizarUnidad(){
        this.validador = false;
    }

    guardarUnidad(){
        this.unidadNueva.peso = this.peso;
        this.unidadNueva.nombre = this.nombreUnidad;
        console.log(this.unidadNueva);
    }

    buscarUnidad(){
        this.validadorBuscar = false;
        console.log("imprimir", this.unidadNueva);
    }
    cancelarUnidad(){
        this.unidadNueva = null;
    }
}


