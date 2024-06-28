import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { MantenimientoUnidad } from 'src/app/model/mantenimiento-unidad';
import { MantenimientoUnidadService } from 'src/app/service/mantenimiento-unidad-service';
import { MantenimientoPesoHoraService } from 'src/app/service/mantenimiento-peso-hora-service';
import { MantenimientoPesoHora } from 'src/app/model/mantenimiento-peso-hora';


@Component({
    selector: 'app-mantenimiento-unidad-programacion',
    templateUrl: './mantenimiento-unidad-programacion.component.html',
    styleUrls: ['./mantenimiento-unidad-programacion.component.scss']
})
export class Mantenimiento_unidadprogramacion implements OnInit {
    validador: boolean = true; 
    validadorBuscar: boolean = true;
    unidadNueva: MantenimientoUnidad = new MantenimientoUnidad();
    pesos: number[] = [];
    mantenimientosUnidad: MantenimientoUnidad[] = [];
    peso: number = 0;
    nombreUnidad: string = "";
    mantenimientoSeleccionado: MantenimientoUnidad = new MantenimientoUnidad();
    mantenimientosPesoHora: MantenimientoPesoHora[]= [];

    constructor(private mantenimientoUnidadServ: MantenimientoUnidadService,
        private mantenimientoPesoHoraServ: MantenimientoPesoHoraService,
        private toastr: ToastrService) { }

    ngOnInit(): void {
        this.getMantenimientoUnidad();
    }

    getMantenimientoUnidad(){
        this.mantenimientoUnidadServ.getMantenimientos().subscribe(data =>{
            this.mantenimientosUnidad = data;
        });

        this.mantenimientoPesoHoraServ.getPesoHora().subscribe(data =>{
            this.mantenimientosPesoHora = data;
            this.pesos = [];
            this.mantenimientosPesoHora.forEach((element) =>{
                this.pesos.push(element.peso);
            });
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
        console.log(this.unidadNueva)
        this.mantenimientoUnidadServ.createUnidad(this.unidadNueva).subscribe(data =>{
            this.toastr.success('se a guardado correctamente');
            this.unidadNueva = new MantenimientoUnidad;
            this.getMantenimientoUnidad();
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
        });
    }

    buscarUnidad(){
        this.validadorBuscar = false;
        console.log("imprimir", this.mantenimientoSeleccionado);
    }
    cancelarUnidad(){
        this.unidadNueva = new MantenimientoUnidad;
    }

    actualizarUnidad(){
        this.mantenimientoUnidadServ.updateUnidad(this.mantenimientoSeleccionado).subscribe(data =>{
            this.toastr.success('se a actualizado correctamente');
            this.mantenimientoSeleccionado = new MantenimientoUnidad;
            this.validadorBuscar = true;
            this.getMantenimientoUnidad();
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
        });
    }

    eliminarUnidad(){
        this.mantenimientoUnidadServ.deleteUnidad(this.mantenimientoSeleccionado.id).subscribe(data =>{
            this.toastr.success('se a eliminado correctamente');
            this.mantenimientoSeleccionado = new MantenimientoUnidad;
            this.validadorBuscar = true;
            this.getMantenimientoUnidad();
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
        });
    }
}


