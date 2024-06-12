import { Component, OnInit } from '@angular/core';
import { Actividad } from 'src/app/Model/actividad';
import { ActividadService } from 'src/app/service/actividad.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProyectoService } from 'src/app/service/proyecto.service';
import { FaseProyectoService } from 'src/app/service/fase-proyecto.service';
import { Proyecto } from 'src/app/Model/proyecto';
import { FaseProyecto } from 'src/app/Model/fase-proyecto';

@Component({
    selector: 'app-actividades',
    templateUrl: './actividades.component.html',
    styleUrls: ['./actividades.component.scss']
})
export class ActividadesComponent implements OnInit {

    actividades: Actividad[] = [];
    addActividadModal: NgbModalRef;
    idProyecto: number;
    fases: FaseProyecto[] = [];

    formNewActividad: FormGroup;
    submittedNA: boolean = false;
    newActividad: Actividad = new Actividad();

    formEditActividad: FormGroup;
    submittedEA: boolean = false;
    actividadToEdit: Actividad = new Actividad();

    constructor(private actividadService: ActividadService,
        private toastr: ToastrService,
        private router: Router,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private faseService: FaseProyectoService) { }

    session = localStorage.getItem('session');

    ngOnInit(): void {
        this.getFases();
        this.session = JSON.parse(this.session);

        this.getActividades();

        this.buildFormNewActividad();
        this.buildFormEditActividad();
    }

    get fna() {
        return this.formNewActividad.controls;
    }

    buildFormNewActividad() {
        this.formNewActividad = this.formBuilder.group({
            fase: ['', [
                Validators.required
            ]],
            actividad: ['', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(50),
                Validators.pattern('[áéíóúñÁÉÍÓÚÑ.()/:_,A-Z- ]{3,100}')
            ]]
        });
    }

    get fea() {
        return this.formEditActividad.controls;
    }

    buildFormEditActividad() {
        this.formEditActividad = this.formBuilder.group({
            faseEdit: ['', [
                Validators.required
            ]],
            actividadEdit: ['', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(50),
                Validators.pattern('[áéíóúñÁÉÍÓÚÑ.()/:_,A-Z- ]{3,100}')
            ]]
        });
    }

    getActividades() {
        this.actividadService.getActividades().subscribe(data => {
            this.actividades = data.sort((a, b) => (a.actividad < b.actividad ? -1 : 1));
        }, error => {
            console.log(error);
            this.toastr.error(error);
        });
    }

    edit() {
        this.submittedEA = true;

        if (this.formEditActividad.invalid) {
            return;
        }
        this.actividadService.updateActividad(this.actividadToEdit.id, this.actividadToEdit).subscribe(data => {
            this.actividadToEdit = new Actividad();
            this.toastr.info('Actividad actualizada correctamente.');
            this.getActividades();
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
        });
    }

    loadActividad(id: number) {
        this.actividadService.getActividadById(id).subscribe(data => {
            this.actividadToEdit = data;
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        }, error => {
            console.log(error);
            this.toastr.error(error);
        });
    }

    delete(id: number) {
        this.actividadService.deleteActividad(id).subscribe(data => {
            this.toastr.warning('Actividad eliminada correctamente.');
            this.getActividades();
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
        });
    }

    cancelar() {
        this.actividadToEdit = new Actividad();
    }

    openAddActividadModal(content) {
        this.addActividadModal = this.modalService.open(content);
    }

    getFases() {
        this.faseService.getFases().subscribe(data => {
            this.fases = data.sort((a, b) => (a.fase < b.fase ? -1 : 1));
        }, error => {
            console.log(error);
        });
    }

    saveActividad() {
        this.submittedNA = true;

        if (this.formNewActividad.invalid) {
            return;
        }

        this.newActividad.base = true;
        this.newActividad.proyecto = null;
        this.actividadService.createActividad(this.newActividad).subscribe(data => {
            this.modalService.dismissAll();
            this.toastr.success('Se ha guardado la actividad correctamente');
            this.newActividad = new Actividad();
            this.getActividades();
            console.log(data);
        }, error => {
            this.toastr.error(error.error);
            console.log(error);
        });
    }

}
