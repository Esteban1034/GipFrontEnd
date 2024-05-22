import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PSRService } from 'src/app/service/project-status-report.service';
import { ParametriaGeneralMatrizTiempo } from 'src/app/model/parametria-general-matriz-tiempo';
import { ParametriaRecursosMatrizTiempo } from 'src/app/model/parametria-recursos-matriz-tiempo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ParametriaGeneralMatrizTiempoService } from 'src/app/service/matriz-tiempos-parametria-general.service';
import { Cargo } from 'src/app/model/cargo';
import { CargoService } from 'src/app/service/cargo.service';
import { Console } from 'console';
import { ParametriaRecursosMatrizTiempoService } from 'src/app/service/matriz-tiempos-parametria-recursos.service';
import { finalize } from 'rxjs/operators';
import { EspecialidadRecurso } from 'src/app/model/especialidad-recurso';
import { PerfilRecurso } from 'src/app/model/perfil-recurso';
@Component({
    selector: 'app-parametria-matriz-tiempos',
    templateUrl: './parametria-matriz-tiempos.component.html',
    styleUrls: ['./parametria-matriz-tiempos.component.scss']
})

export class ParametriaMatrizTiempos implements OnInit {

    defaultNavActiveId = 1;
    parametriaGeneralMatrizTiempo: ParametriaGeneralMatrizTiempo = new ParametriaGeneralMatrizTiempo();
    parametriaRecursosMatrizTiempo: ParametriaRecursosMatrizTiempo = new ParametriaRecursosMatrizTiempo();
    parametriaRecursosMatrizTiempoList: ParametriaRecursosMatrizTiempo[] = [];
    formParametrosGenerales: FormGroup;
    formParametrosRecursos: FormGroup;
    submitted: boolean = false;
    mostrarModuloCrear: boolean = false;
    modalAgregarPerfil: NgbModalRef;
    modalEditar: NgbModalRef;
    modalEliminar: NgbModalRef;
    dataSource = new MatTableDataSource();
    especialidades: EspecialidadRecurso[] = [];
    perfiles: PerfilRecurso[] = [];
    idToDelete: number;
    idToUpdate: number;
    recursoParametria: any;
    updateRecurso: ParametriaRecursosMatrizTiempo = new ParametriaRecursosMatrizTiempo();
    tarifaHoraFormateada: string;
    tarifaMensualFormateada: string;
    tarifaMesualUpdate: string;
    tarifaHoraUpdate: string;
    recursoSeleccionado: ParametriaRecursosMatrizTiempo = new ParametriaRecursosMatrizTiempo();
    especialidadRecurso: any;
    perfilRecurso: any;
    recursoCreado: boolean;


    @ViewChild(MatSort) matSort: MatSort;

    constructor(
        private modalService: NgbModal,
        private cargoService: CargoService,
        private parametriaRecursosMatrizTiempoService: ParametriaRecursosMatrizTiempoService,
        private parametriaGeneralMatrizTiempoService: ParametriaGeneralMatrizTiempoService,
        private formBuilder: FormBuilder,
        private toast: ToastrService) { }

    columnas: string[] = ['especialidad', 'perfil', 'tarifa_hora', 'tarifa_mensualidad', 'descripcion', 'opciones'];

    ngOnInit(): void {
        this.buildParametrosGenerales();
        this.buildParametrosRecursos();
        this.getParametriaGeneral();
        this.getParametriaRecursos();
        this.getListEspecialidades();
    }

    getParametriaGeneral() {
        this.parametriaGeneralMatrizTiempoService.getParametriaGeneral().subscribe(data => {
            this.parametriaGeneralMatrizTiempo = data;
        }, error => console.log(error));
    }

    getParametriaRecursos() {
        this.parametriaRecursosMatrizTiempoService.getParametriaRecursos().subscribe(data => {
            this.parametriaRecursosMatrizTiempoList = data.sort((a, b) => {
                const especialidadComparison = a.especialidad.especialidad.localeCompare(b.especialidad.especialidad);
                if (especialidadComparison !== 0) {
                  return especialidadComparison;
                }
                return a.perfil.perfil.localeCompare(b.perfil.perfil);
              });
            this.dataSource = new MatTableDataSource(this.castListObjectToStringList(this.parametriaRecursosMatrizTiempoList));
        }, error => console.log(error));
    }

    updateParametriaGeneral() {
        this.parametriaGeneralMatrizTiempoService.updateParametriaGeneral(this.parametriaGeneralMatrizTiempo).subscribe(data => {
            this.toast.success('Se actualiza parametria general satisfactoriamente');
        }, error => this.toast.error(error.message));
    }

    saveParametriaRecursos() {
        this.parametriaRecursosMatrizTiempoService.saveParametriaRecursos(this.parametriaRecursosMatrizTiempo).subscribe(data => {
            this.toast.success('Se agrega perfil satisfactoriamente');
            this.parametriaRecursosMatrizTiempo = new ParametriaRecursosMatrizTiempo;
            this.limpiar();
            this.modalAgregarPerfil.close();
            this.getParametriaRecursos();
        }, error => this.toast.error(error.message));
    }

    updateParametriaRecurso() {
        this.parametriaRecursosMatrizTiempoService.updateParametriaRecursos(this.idToUpdate, this.updateRecurso).subscribe(data => {
            this.toast.success('Se modifico perfil correctamente');
            this.updateRecurso = new ParametriaRecursosMatrizTiempo;
            this.updateRecurso.descripcion = '';
            this.modalEditar.close();
            this.getParametriaRecursos();
            this.tarifaHoraFormateada = '';
            this.tarifaMensualFormateada = '';
        }, error => this.toast.error(error.message));
    }

    deleteModal(content, id: number) {
        this.modalEliminar = this.modalService.open(content);
        this.idToDelete = id;
    }

    deleteParametriaPerfil() {
        this.parametriaRecursosMatrizTiempoService.deleteParametriaRecursos(this.idToDelete).pipe(finalize(() => this.limpiar())
        ).subscribe(data => {
            this.modalEliminar.close();
            this.idToDelete = undefined;
            this.getParametriaRecursos();
            this.toast.warning('Perfil eliminado correctamente!');
        }, error => {
            this.modalService.dismissAll();
            console.log(error.error);
        });
    }

    showAgregarPerfilModal(content) {
        this.submitted = false;
        this.modalAgregarPerfil = this.modalService.open(content);
    }

    showEditarPerfilModal(content, id: number) {
        this.submitted = false;
        this.idToUpdate = id;
        this.getParametriaRecursoSelect(this.idToUpdate);
        this.modalEditar = this.modalService.open(content);
    }

    getParametriaRecursoSelect(id: number){
        this.parametriaRecursosMatrizTiempoService.searchParametriaRecursos(id).subscribe(data => {
            this.recursoSeleccionado = data;
            this.tarifaHoraFormateada =  this.recursoSeleccionado.tarifaHora.toString() ;
            this.tarifaMensualFormateada = this.recursoSeleccionado.tarifaMensual.toString();
            this.especialidadRecurso = this.recursoSeleccionado.especialidad;
            this.perfilRecurso = this.recursoSeleccionado.perfil;
            this.updateRecurso.descripcion = this.recursoSeleccionado.descripcion;
            this.updateRecurso.tarifaHora = this.recursoSeleccionado.tarifaHora;
            this.updateRecurso.tarifaMensual = this.recursoSeleccionado.tarifaMensual;
            this.tarifaHoraFormateada = ` $${this.recursoSeleccionado.tarifaHora.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
            this.tarifaMensualFormateada = ` $${this.recursoSeleccionado.tarifaMensual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
        }, error => console.log(error));
    }

    getListEspecialidades() {
        this.parametriaRecursosMatrizTiempoService.getEspecialidadRecursos().subscribe(data => {
            this.especialidades = data.sort((a, b) => a.especialidad.localeCompare(b.especialidad));
        }, error => console.log(error));
    }

    async getListPerfiles(id: number) {
        this.parametriaRecursosMatrizTiempo.perfil = undefined;
        await this.parametriaRecursosMatrizTiempoService.getPerfilRecursos(id).subscribe(data => {
            this.perfiles = data.sort((a,b) => a.perfil.localeCompare(b.perfil));
        }, error => console.log(error));
    }

    get f() { return this.formParametrosGenerales.controls; }

    buildParametrosGenerales() {
        this.formParametrosGenerales = this.formBuilder.group({
            mesesMaximo: ['', Validators.required],
            sprintsMaximo: ['', Validators.required],
            semanaSprintMaximo: ['', Validators.required],
            diaSprintMaximo: ['', Validators.required],
            recursosMaximo: ['', Validators.required],
            numeroHoras: ['', Validators.required]
        });
    }

    get r() { return this.formParametrosRecursos.controls; }

    buildParametrosRecursos() {
        this.formParametrosRecursos = this.formBuilder.group({
            especialidad: ['', Validators.required],
            cargo: ['', Validators.required],
            tarifaHora: ['', Validators.required],
            tarifaMensual: ['', Validators.required],
            descripcion: ['', Validators.required]
        });
    }

    guardarParametrosGenerales() {
        this.submitted = true;
        if (this.formParametrosGenerales.invalid) {
            return;
        }
        this.updateParametriaGeneral();
    }

    guardarParametrosRecursos() {
        this.recursoCreado = false;
        this.submitted = true;
        if (this.formParametrosRecursos.invalid) {
            return;
        }

        this.parametriaRecursosMatrizTiempoList.forEach(element => {
            if (element.especialidad.especialidad === this.parametriaRecursosMatrizTiempo.especialidad.especialidad && element.perfil.perfil === this.parametriaRecursosMatrizTiempo.perfil.perfil){
                this.toast.error('La especialidad y perfil a crear ya existe.');
                this.recursoCreado = true;
                return;
            }
        })

        if(this.recursoCreado === false){
            this.saveParametriaRecursos();
        }
    }

    updateParametrosRecursos() {
        this.submitted = true;
        
        if (this.updateRecurso.especialidad === undefined){
            this.updateRecurso.especialidad = this.especialidadRecurso;
        }
        if (this.updateRecurso.perfil === undefined){
            this.updateRecurso.perfil = this.perfilRecurso;
        }

        this.updateParametriaRecurso();
    }

    cancelarModalRecursos() {
        this.parametriaRecursosMatrizTiempo = new ParametriaRecursosMatrizTiempo;
        this.tarifaHoraFormateada = '';
        this.tarifaMensualFormateada = '';
        this.modalAgregarPerfil.close();
    }

    cancelarModalRecursosUpdate() {
        this.updateRecurso = new ParametriaRecursosMatrizTiempo;
        this.tarifaHoraFormateada = '';
        this.tarifaMensualFormateada = '';
        this.modalEditar.close();
    }

    cancelBotton() {
        this.getParametriaGeneral()
    }

    castListObjectToStringList(listaObj: ParametriaRecursosMatrizTiempo[]) {
        let listString: ParametriaRecursosMatrizTiempoString[] = [];
        const formateador = new Intl.NumberFormat('es-ES');

        listaObj.forEach(obj => {
            let string: ParametriaRecursosMatrizTiempoString = new ParametriaRecursosMatrizTiempoString();
            string.id = obj.id;
            string.perfil = obj.perfil.perfil;
            string.especialidad = obj.especialidad.especialidad;
            string.tarifaHora = formateador.format(obj.tarifaHora);
            string.tarifaMensual = formateador.format(obj.tarifaMensual);
            string.descripcion = obj.descripcion;

            listString.push(string);
        });
        return listString;
    }

    formatearTarifaHora(validador: boolean) {
        this.tarifaHoraFormateada = this.tarifaHoraFormateada.replace(/[^\d]/g, '');
        if (validador == true) {
            this.parametriaRecursosMatrizTiempo.tarifaHora = parseInt(this.tarifaHoraFormateada);
            this.tarifaHoraFormateada = `$${this.parametriaRecursosMatrizTiempo.tarifaHora.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
        } else {
            this.updateRecurso.tarifaHora = parseInt(this.tarifaHoraFormateada);
            this.tarifaHoraFormateada = `$${this.updateRecurso.tarifaHora.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
        }
    }

    formatearTarifaMensual(validador: boolean) {
        this.tarifaMensualFormateada = this.tarifaMensualFormateada.replace(/[^\d]/g, '');
        if (validador == true) {
            this.parametriaRecursosMatrizTiempo.tarifaMensual = parseInt(this.tarifaMensualFormateada);
            this.tarifaMensualFormateada = `$${this.parametriaRecursosMatrizTiempo.tarifaMensual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
        } else {
            this.updateRecurso.tarifaMensual = parseInt(this.tarifaMensualFormateada);
            this.tarifaMensualFormateada = `$${this.updateRecurso.tarifaMensual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
        }

    }

    validarNumeros(event: KeyboardEvent) {
        const codigoTecla = event.keyCode;
        if (
            (codigoTecla < 48 || codigoTecla > 57) &&
            codigoTecla !== 8 &&
            codigoTecla !== 9
        ) {
            event.preventDefault();
        }
    }

    limpiar() {

        this.parametriaRecursosMatrizTiempo = new ParametriaRecursosMatrizTiempo();
        this.parametriaRecursosMatrizTiempo.descripcion = undefined;
        this.tarifaHoraFormateada = "";
        this.tarifaMensualFormateada = "";
        this.tarifaMesualUpdate = "";
        this.tarifaHoraUpdate = "";
    }
    
}

export class ParametriaRecursosMatrizTiempoString {
    id: number;
    especialidad: string;
    perfil: string;
    tarifaHora: string;
    tarifaMensual: string;
    descripcion: string;
}
