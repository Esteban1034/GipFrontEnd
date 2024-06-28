import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { MantenimientoUnidad } from 'src/app/model/mantenimiento-unidad';
import { MantenimientoUnidadService } from 'src/app/service/mantenimiento-unidad-service';
import { MantenimientoPesoHora } from 'src/app/model/mantenimiento-peso-hora';
import { MantenimientoPesoHoraService } from 'src/app/service/mantenimiento-peso-hora-service';


@Component({
    selector: 'app-mantenimiento_peso-hora',
    templateUrl: './mantenimiento-peso-hora.component.html',
    styleUrls: ['./mantenimiento-peso-hora.component.scss']
})
export class mantenimiento_peso implements OnInit {
    validador: boolean = true; 
    validadorBuscar: boolean = true;
    unidadNueva: MantenimientoPesoHora = new MantenimientoPesoHora();
    pesos: number[] = [1,2,3,4,5,6,7,8,9,10,22,34,53,23];
    mantenimientosPesoHora: MantenimientoPesoHora[] = [];
    mantenimientoSeleccionado: MantenimientoPesoHora = new MantenimientoPesoHora();


    constructor(private mantenimientoService: MantenimientoPesoHoraService,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.mantenimientoService.getPesoHora().subscribe(data =>{
            this.mantenimientosPesoHora = data;
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
        console.log(this.unidadNueva);
        this.mantenimientoService.createPesoHora(this.unidadNueva).subscribe(data =>{
            this.toastr.success('se a guardado correctamente');
            this.unidadNueva = new MantenimientoPesoHora;
            this.obtenerPesosHoras();
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
        });
    }

    obtenerPesosHoras(){
        this.mantenimientoService.getPesoHora().subscribe(data =>{
            this.mantenimientosPesoHora = data;
        });
    }

    buscarUnidad(){
        this.validadorBuscar = false;
        console.log("imprimir", this.mantenimientoSeleccionado);
    }

    cancelarUnidad(){
        this.unidadNueva = new MantenimientoPesoHora;
    }

    actuallizarPesoHora(){
        this.mantenimientoService.updatePesoHora(this.mantenimientoSeleccionado).subscribe(data =>{
            this.toastr.success('se a actualizado correctamente');
            this.mantenimientoSeleccionado = new MantenimientoPesoHora;
            this.validadorBuscar = true;
            this.obtenerPesosHoras();
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
        });
    }

    eliminarPesoHora(){
        this.mantenimientoService.deletePesoHora(this.mantenimientoSeleccionado.id).subscribe(data =>{
            this.toastr.success('se a eliminado correctamente');
            this.mantenimientoSeleccionado = new MantenimientoPesoHora;
            this.validadorBuscar = true;
            this.obtenerPesosHoras();
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
        });
    }
}




