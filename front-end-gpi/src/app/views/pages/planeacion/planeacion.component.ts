import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Actividad } from 'src/app/Model/actividad';
import { ActividadAsignadaService } from 'src/app/service/actividad-asignada.service';
import { ActividadService } from 'src/app/service/actividad.service';
import { FaseProyectoService } from 'src/app/service/fase-proyecto.service';
import { ProyectoService } from 'src/app/service/proyecto.service';
import { FaseProyecto } from 'src/app/Model/fase-proyecto';
import { EmpleadoService } from 'src/app/service/empleado.service';
import { RecursoActividad } from 'src/app/Model/recurso-actividad';
import { RecursoActividadService } from 'src/app/service/recurso-actividad.service';
import { ReporteTiempoService } from 'src/app/service/reporte-tiempo.service';
import { ReporteTiempo } from 'src/app/Model/reporte-tiempo';
import { Proyecto } from 'src/app/Model/proyecto';
import { ActividadAsignada } from 'src/app/Model/actividad-asignada';
import { Empleado } from 'src/app/model/empleado';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Especialidad } from 'src/app/model/especialidad';
import { EspecialidadService } from 'src/app/service/especialidad.service';
import { EmpleadoString } from 'src/app/model/dto/empleado-string';

@Component({
    selector: 'app-planeacion',
    templateUrl: './planeacion.component.html',
    styleUrls: ['./planeacion.component.scss']
})
export class PlaneacionComponent implements OnInit {

    errorMsj = '';
    idProyecto: number = undefined;
    idActividad: number = undefined;
    idDeleteRecursoActividad: number = undefined;
    totalHoras: number = 0;
    active = 2;
    proyecto: Proyecto = new Proyecto();
    newActividad: Actividad = new Actividad();
    actividades: Actividad[] = [];
    newActividadAsig: ActividadAsignada = new ActividadAsignada();
    actividadAsig: ActividadAsignada = new ActividadAsignada();
    actividadesAsig: ActividadAsignada[] = [];
    fechasAsigRecursoActividad: RecursoActividad[] = [];
    dataSourceFechasAsigRecursoActividad: RecursoActividad[] = [];
    actividadAsigForDates: ActividadAsignada = new ActividadAsignada();
    faseSearch: FaseProyecto = new FaseProyecto();
    newFase: FaseProyecto = new FaseProyecto();
    selectedFase: FaseProyecto = new FaseProyecto();
    fases: FaseProyecto[] = [];
    empleados: Empleado[] = [];
    empDisponibilidad: Empleado = new Empleado();
    empAsignaciones: Empleado = new Empleado();
    newRecursosActividades: RecursoActividad[] = [];
    fechasAsigEmp: RecursoActividad[] = [];
    empleadosAsig: Empleado[] = [];
    especialidades: Especialidad[] = [];
    especialidadSelected: Especialidad = new Especialidad();
    nombreToSearch: string = '';
    actividadToEdit: ActividadAsignada = new ActividadAsignada();
    actividadShowDates: ActividadAsignada = new ActividadAsignada();

    modalConfirmEmpAsig: NgbModalRef;
    modalConfirmFechaAsig: NgbModalRef;
    modalEditActividad: NgbModalRef;
    modalShowDatesActividad: NgbModalRef;

    formNewFase: FormGroup;
    submittedNF: boolean = false;
    formNewActividad: FormGroup;
    submittedNA: boolean = false;
    formSelectFase: FormGroup;
    submittedSF: boolean = false;
    formSearchByFase: FormGroup;
    submittedFSBF: boolean = false;
    formNewActividadAsig: FormGroup;
    submittedFNAA: boolean = false;
    formEditActividad: FormGroup;
    submittedFEA: boolean = false;

    dateOptions: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    constructor(private modalService: NgbModal,
        private route: ActivatedRoute,
        private proyectoService: ProyectoService,
        private faseService: FaseProyectoService,
        private toast: ToastrService,
        private actividadService: ActividadService,
        private actividadAsigService: ActividadAsignadaService,
        private empleadoService: EmpleadoService,
        private recursoActService: RecursoActividadService,
        private reporteService: ReporteTiempoService,
        private formBuilder: FormBuilder,
        private especialidadService: EspecialidadService,
        private router: Router) {

    }

    session = localStorage.getItem('session');
    sessionObject: EmpleadoString = new EmpleadoString();

    ngOnInit(): void {
        this.sessionObject = JSON.parse(this.session);
        this.session = JSON.parse(this.session);

        this.idProyecto = this.route.snapshot.params['id'];

        this.setProyecto();
        this.getActividadesAsignadas();
        this.getTotalHoras();
        this.getFases();
        this.getEspecialidades();

        this.buildFormNewFase();
        this.buildFormNewActividad();
        this.buildFormSelectFase();
        this.buildFormSearchByFase();
        this.buildFormNewActividadAsig();
        this.buildFormEditActividad();
    }

    setProyecto() {
        this.proyectoService.getProyectoById(this.idProyecto).subscribe(data => {
            this.proyecto = data;
        }, error => {
            console.log(error);
        });
    }

    getEspecialidades() {
        this.especialidadService.getEspecialidadesList().subscribe(data => {
            this.especialidades = data;
        }, error => {
            this.toast.error(error);
        });
    }

    get fnf() {
        return this.formNewFase.controls;
    }

    buildFormNewFase() {
        this.formNewFase = this.formBuilder.group({
            fase: ['', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(100),
                Validators.pattern('[áéíóúñÁÉÍÓÚÑ.()/:_,A-Z- ]{3,100}')
            ]]
        });
    }

    get fna() {
        return this.formNewActividad.controls;
    }

    buildFormNewActividad() {
        this.formNewActividad = this.formBuilder.group({
            actividad: ['', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(100),
                Validators.pattern('[áéíóúñÁÉÍÓÚÑ.()/:_,A-Z- ]{3,100}')
            ]],
            fase: ['', [
                Validators.required
            ]]
        });
    }

    get fsf() {
        return this.formSelectFase.controls;
    }

    buildFormSelectFase() {
        this.formSelectFase = this.formBuilder.group({
            fase: ['', [
                Validators.required
            ]]
        });
    }

    get fsbf() {
        return this.formSearchByFase.controls;
    }

    buildFormSearchByFase() {
        this.formSearchByFase = this.formBuilder.group({
            faseSearch: ['', [
                Validators.required
            ]]
        });
    }

    get fea() {
        return this.formEditActividad.controls;
    }

    buildFormEditActividad() {
        this.formEditActividad = this.formBuilder.group({
            fechaInicio: ['', [
                Validators.required
            ]],
            fechaFin: ['', [
                Validators.required
            ]]
        });
    }

    selectFase() {
        this.submittedSF = true;

        if (this.formSelectFase.invalid) {
            return;
        }

        this.actividadService.findByFase(this.selectedFase.id).subscribe(data => {
            console.log('ACTIVIDADES', data);
            this.actividades = data.sort((a, b) => (a.actividad < b.actividad ? -1 : 1));
            this.showActividadAsigToPlan();
            this.hideFaseToPlan();
        }, error => {
            this.toast.error(error);
        });
    }

    cancelActividadAsig() {
        this.hideActividadAsigToPlan();
        this.showFaseToPlan();
        this.selectedFase = new FaseProyecto();
    }

    getFases() {
        this.proyectoService.getProyectoById(this.idProyecto).subscribe(data => {
            this.proyecto = data;
            this.fases = [];
            if (this.proyecto.etapa.etapa === 'CRN') {
                this.faseService.findByProyectoAndBase(this.idProyecto).subscribe(data => {
                    data.forEach(fase => {
                        if (fase.fase !== 'PROPUESTA') {
                            this.fases.push(fase);
                        }
                    });
                    this.fases = this.fases.sort((a, b) => (a.fase < b.fase ? -1 : 1));
                }, error => {
                    this.toast.error(error);
                });
            } else if (this.proyecto.etapa.etapa === 'PRP') {
                this.faseService.getFases().subscribe(data => {
                    data.forEach(fase => {
                        if (fase.fase === 'PROPUESTA') {
                            this.fases.push(fase);
                        }
                    });
                }, error => {
                    console.log(error);
                });
            }


        }, error => {
            console.log(error);
        });
    }

    get fnaa() {
        return this.formNewActividadAsig.controls;
    }

    buildFormNewActividadAsig() {
        this.formNewActividadAsig = this.formBuilder.group({
            actividad: ['', [
                Validators.required
            ]],
            fechaInicio: ['', [
                Validators.required
            ]],
            fechaFin: ['', [
                Validators.required
            ]]
        });
    }

    showFaseToPlan() {
        document.getElementById('faseToPlan').classList.remove('d-none');
    }

    hideFaseToPlan() {
        document.getElementById('faseToPlan').classList.add('d-none');
    }

    showActividadAsigToPlan() {
        document.getElementById('actividadAsigToPlan').classList.remove('d-none');
    }

    hideActividadAsigToPlan() {
        document.getElementById('actividadAsigToPlan').classList.add('d-none');
    }

    getActividadesAsignadas() {
        this.actividadAsigService.findByProyecto(this.idProyecto).subscribe(data => {
            this.actividadesAsig = data;

            for (let i = 0; i < this.actividadesAsig.length; i++) {
                this.recursoActService.existsByActividad(this.actividadesAsig[i].id).subscribe(data => {
                    this.actividadesAsig[i].recursos = data;
                }, error => this.toast.error(error));
            }

        }, error => {
            this.toast.error(error);
        });
    }

    getFechasAsignadsActividad(idActividad: number) {
        this.recursoActService.findByActividad(idActividad).subscribe(data => {
            data.sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
            this.fechasAsigRecursoActividad = data;
            this.dataSourceFechasAsigRecursoActividad = data;
        }, error => {
            this.toast.error(error);
        });
    }

    saveFase() {
        this.submittedNF = true;

        if (this.formNewFase.invalid) {
            return;
        }

        this.newFase.proyecto = this.proyecto;
        this.newFase.base = false;
        this.faseService.createFase(this.newFase).subscribe(data => {
            this.modalService.dismissAll();
            this.toast.success('Se ha guardado la fase correctamente');
            this.newFase = new FaseProyecto();
            this.getFases();
            this.formNewFase.reset();
        }, error => {
            this.toast.error(error.error);
        });
    }

    saveActividad() {
        this.submittedNA = true;

        if (this.formNewActividad.invalid) {
            return;
        }

        this.newActividad.base = false;
        this.newActividad.proyecto = this.proyecto;
        this.actividadService.createActividad(this.newActividad).subscribe(data => {
            console.log('ACTIVIDAD CREADA', data);
            this.modalService.dismissAll();
            this.toast.success('Se ha guardado la actividad correctamente');
            this.newActividad = new Actividad();
        }, error => {
            this.toast.error(error.error);
        });
    }

    saveActividadAsig() {
        this.submittedFNAA = true;

        if (this.formNewActividadAsig.invalid) {
            return;
        }

        this.newActividadAsig.proyecto = this.proyecto;

        let actAsig: ActividadAsignada[] = [];
        this.actividadAsigService.findByProyecto(this.proyecto.id).subscribe(data => {
            actAsig = data;
            for (let i = 0; i < actAsig.length; i++) {
                if (actAsig[i].actividad.id == this.newActividadAsig.actividad.id) {
                    return this.toast.error('La actividad a asignar ya esta registrada.');
                }
            }
            this.createActividadAsig(this.newActividadAsig);
        }, error => {
            this.toast.error(error.error)
        });
    }

    createActividadAsig(actividad: ActividadAsignada) {
        this.actividadAsigService.createActividad(actividad).subscribe(data => {
            this.toast.success('Actividad agregada correctamente!');
            this.newActividadAsig = new ActividadAsignada();
            this.getActividadesAsignadas();
            this.submittedSF = false;
            this.cancelActividadAsig();
        }, error => {
            console.log(error);
            this.toast.error(error.error);
        });
    }

    searchActividadByFase() {
        this.submittedFSBF = true;

        if (this.formSearchByFase.invalid) {
            return;
        }

        this.actividadAsigService.findByFase(this.idProyecto, this.faseSearch.id).subscribe(data => {
            this.actividadesAsig = data;

            if (this.actividadesAsig.length == 0) {
                this.clear();
                return this.toast.warning('No se han encontrado resultados con la fase seleccionada');
            }

            for (let i = 0; i < this.actividadesAsig.length; i++) {
                this.recursoActService.existsByActividad(this.actividadesAsig[i].id).subscribe(data => {
                    this.actividadesAsig[i].recursos = data;
                }, error => this.toast.error(error));
            }

        }, error => this.toast.error(error));
    }

    clear() {
        this.faseSearch = new FaseProyecto();
        this.getActividadesAsignadas();
    }

    open(content) {
        this.modalService.open(content);
    }

    openConfirmEmpAsig(content, id: number) {
        this.modalConfirmEmpAsig = this.modalService.open(content);
        (<HTMLInputElement>document.getElementById('idDeleteEmpAsig')).value = id.toString();
    }

    closeConfirmEmpAsig() {
        this.modalConfirmEmpAsig.close();
    }

    deleteEmplAsig() {
        let id: number = parseFloat((<HTMLInputElement>document.getElementById('idDeleteEmpAsig')).value);

        this.recursoActService.deleteByEmpleadoAndActividad(id, this.actividadAsig.id).subscribe(data => {
            this.toast.warning('Se ha eliminado el recurso correctamente de la planeacion');
            this.getEmpleadoAsignados();
            this.getActividadesAsignadas();
            this.closeConfirmEmpAsig();
        }, error => this.toast.error(error));
    }

    openConfirmFechaAsig(content, id: number) {
        this.idDeleteRecursoActividad = id;
        this.modalConfirmFechaAsig = this.modalService.open(content);
    }

    closeConfirmFechaAsig() {
        this.modalConfirmFechaAsig.close();
    }

    deleteFechaAsignada() {
        this.recursoActService.deleteRecursoActividad(this.idDeleteRecursoActividad).subscribe(data => {
            this.toast.warning('Se ha eliminado la fecha planeada correctamente');
            this.getActividadesAsignadas();
            this.closeConfirmFechaAsig();
            this.getFechasAsignadsActividad(this.actividadAsigForDates.id);
        }, error => this.toast.error(error));
    }

    openRecursoModal(content, id: number) {
        this.empAsignaciones = new Empleado();
        this.empDisponibilidad = new Empleado();
        this.idActividad = id;

        this.actividadAsigService.getActividadById(this.idActividad).subscribe(data => {
            this.actividadAsig = data;
        }, error => this.toast.error(error));

        this.empleadoService.getAvailableEmpleados(this.idActividad).subscribe(data => {
            this.empleados = data.sort((a, b) => (a.nombre < b.nombre ? -1 : 1));
        }, error => this.toast.error(error));

        this.getEmpleadoAsignados();

        this.modalService.open(content, { size: 'xl', scrollable: true });
    }

    viewDisponibilidad(idEmpleado: number) {
        this.empleadoService.getEmpleadoById(idEmpleado).subscribe(data => {
            this.empDisponibilidad = data;
        }, error => this.toast.error(error));

        this.recursoActService.getNewListByFecha(idEmpleado, this.idActividad).subscribe(data => {
            this.showDisponibilidad();
            data.sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
            this.newRecursosActividades = data;
        }, error => this.toast.error(error));

    }

    addRecurso() {
        let list: RecursoActividad[] = [];
        let flag: boolean = false;

        this.newRecursosActividades.forEach(actividad => {
            if (actividad.checked) {
                flag = true;
            }
        });

        if (!flag) {
            return this.toast.error('No ha seleccionado ninguna fecha');
        }

        this.newRecursosActividades.forEach(recurso => {
            if (recurso.checked) {
                list.push(recurso);
            }
        });

        list.forEach(recursoAct => {
            if (recursoAct.actividad.proyecto.interno) {
                recursoAct.asignador = 'SISTEMA';
            }

            recursoAct.asignador = this.sessionObject.nombre;
        });

        this.recursoActService.createRecursoActividadList(list).subscribe(data => {
            this.hideDisponibilidad();
            this.getEmpleadoAsignados();
            this.getActividadesAsignadas();
            console.log("RESPUESTA FECHAS ASIGNADAS: ", data);
            if (Object.entries(data).length > 0) {
                if (Object.entries(data).length === list.length) {
                    this.toast.success('El recurso se ha agregado correctamente a la actividad');
                } else {
                    this.toast.warning('El recurso se ha agregado, pero algunas de las fechas ya tienen recursos asignados');
                }
            } else {
                this.toast.info('Ya existen recursos asignados a las fechas seleccionadas');
            }
        }, error => {
            console.log(error);
            this.toast.error(error.error);
        });
    }

    getEmpleadoAsignados() {
        this.recursoActService.findEmpleadosAsignados(this.idActividad).subscribe(data => {
            this.empleadosAsig = data;
        }, error => this.toast.error(error));
    }

    detailsRecursoAsignado(idEmpleado: number) {
        this.showAsignaciones();

        this.empleadoService.getEmpleadoById(idEmpleado).subscribe(data => {
            this.empAsignaciones = data;
        }, error => this.toast.error(error));

        this.recursoActService.findByEmpleadoAndActividad(idEmpleado, this.actividadAsig.id).subscribe(data => {
            data.sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
            this.fechasAsigEmp = data;
        }, error => this.toast.error(error));
    }

    showDisponibilidad() {
        document.getElementById('recursosDisponibles').classList.add('col-7', 'hide');
        document.getElementById('disponibilidadRecurso').classList.add('d-block');
    }

    hideDisponibilidad() {
        document.getElementById('recursosDisponibles').classList.remove('col-7', 'hide');
        document.getElementById('disponibilidadRecurso').classList.remove('d-block');
        this.empDisponibilidad = new Empleado();
    }

    showAsignaciones() {
        document.getElementById('recursosAsignados').classList.add('col-7', 'hide');
        document.getElementById('fechasAsignadasRecurso').classList.add('d-block');
    }

    hideAsignaciones() {
        document.getElementById('recursosAsignados').classList.remove('col-7', 'hide');
        document.getElementById('fechasAsignadasRecurso').classList.remove('d-block');
        this.empAsignaciones = new Empleado();
    }

    openModalDeleteActividadAsig(content, id: number) {
        this.modalService.open(content);
        (<HTMLInputElement>document.getElementById('idDeleteActividadAsig')).value = id.toString();
    }

    deleteActAsig() {
        let id: number = parseFloat((<HTMLInputElement>document.getElementById('idDeleteActividadAsig')).value);
        this.actividadAsigService.deleteActividad(id).subscribe(data => {
            console.log('ELIMINAR ACTIVIDAD', data);
            this.toast.warning('La actividad asignada se ha eliminado correctamente');
            this.modalService.dismissAll();
            this.getActividadesAsignadas();
        }, error => {
            this.toast.error(error.error);
            this.modalService.dismissAll();
        });
    }

    getTotalHoras() {
        let reportes: ReporteTiempo[] = [];
        let horas: number = 0;
        this.reporteService.findByProyecto(this.idProyecto).subscribe(data => {
            reportes = data;
            for (let i = 0; i < reportes.length; i++) {
                if (reportes[i].estado.id == 2) {
                    horas += reportes[i].horas;
                }
            }
            this.totalHoras = horas;
        }, error => {
            console.log(error);
        });
    }

    searchRecursosByEspecialidad() {
        let isEspecialidadSelected: boolean = this.especialidadSelected.hasOwnProperty('id');
        let isNombreToSearch: boolean = this.nombreToSearch.length > 0;

        if (isEspecialidadSelected && !isNombreToSearch) {
            this.empleadoService.searchRecursosByEspecialidad(this.idActividad, this.especialidadSelected.id).subscribe(data => {
                data.sort((a, b) => (a.nombre < b.nombre ? -1 : 1));
                this.empleados = data;
            }, error => {
                this.toast.error(error.error);
            });

        } else if (isNombreToSearch && !isEspecialidadSelected) {
            this.empleadoService.searchRecursosByNombre(this.idActividad, this.nombreToSearch).subscribe(data => {
                data.sort((a, b) => (a.nombre < b.nombre ? -1 : 1));
                this.empleados = data;
            }, error => {
                this.toast.error(error.error);
            });
        } else if (isEspecialidadSelected && isNombreToSearch) {
            return this.toast.warning("Acción no permitida, Seleccionar solo una de las dos opciones");
        } else if (!isEspecialidadSelected && !isNombreToSearch) {
            return this.toast.warning("Acción no permitida ambas vacias");
        }

    }

    clearRecursosByEspecialidad() {
        this.empleadoService.getAvailableEmpleados(this.idActividad).subscribe(data => {
            data.sort((a, b) => (a.nombre < b.nombre ? -1 : 1));
            this.empleados = data;
            this.especialidadSelected = new Especialidad();
            this.nombreToSearch = '';
        }, error => this.toast.error(error));
    }

    goToAdmonFases() {
        this.modalService.dismissAll();
        this.router.navigate(['/proyectos/admon/fases']);
    }

    goToAdminActividades() {
        this.modalService.dismissAll();
        this.router.navigate(['/proyectos/admon/actividades']);
    }

    openEditActividadModal(content, id: number) {

        this.actividadAsigService.getActividadById(id).subscribe(data => {
            this.actividadToEdit = data;
            console.log('EDITAR ACTIVIDAD', data);
        }, error => {
            console.log(error);
            this.toast.error(error);
        });

        this.modalEditActividad = this.modalService.open(content);
    }

    openDatesActividadModal(content, actividadAsign: ActividadAsignada) {
        this.actividadAsigForDates = actividadAsign;
        this.getFechasAsignadsActividad(actividadAsign.id);

        this.modalShowDatesActividad = this.modalService.open(content);
    }

    filtrar(event: any) {
        const dataSourceFechas = this.dataSourceFechasAsigRecursoActividad.slice();
        const filtro = event.target.value.trim().toLowerCase();
        if (filtro == '') {
            this.fechasAsigRecursoActividad = dataSourceFechas;
        } else {
            const regExpDates = /( de |, )\b/g;
            try {
                this.fechasAsigRecursoActividad = dataSourceFechas.filter(item =>
                    new Date(Number(item.fecha.toString().split('-')[0]), Number(item.fecha.toString().split('-')[1]) - 1, Number(item.fecha.toString().split('-')[2]), 12, 0, 0)
                        .toLocaleString("es-LA", this.dateOptions).toLowerCase().replace(regExpDates, ' ')
                        .indexOf(filtro) !== -1 ||
                    item.empleado.nombre.toLowerCase().indexOf(filtro) !== -1
                );
            }
            catch (error) {
                console.error(error);
            }
        }
    }

    closeDatesActividadModal() {
        this.modalShowDatesActividad.close();
    }

    closeEditActividadModal() {
        this.modalEditActividad.close();
    }

    editarActividad() {
        this.submittedFEA = true;

        if (this.formEditActividad.invalid) {
            return;
        }
        console.log(this.actividadToEdit);
        this.actividadAsigService.updateActividad(this.actividadToEdit.id, this.actividadToEdit).subscribe(data => {
            console.log('ACTUALIZAR ACTIVIDAD', data);
            this.toast.info('Actividad actualizada correctamente.');
            this.getActividadesAsignadas();
            this.closeEditActividadModal();
        }, error => {
            console.log(error);
            this.toast.error(error.error);
        });
    }

    refresh() {
        window.location.reload();
    }

    validateSession(): boolean {
        if (!this.sessionObject.id && !this.sessionObject.nombre) {
            this.toast.error("Session Cerrada, inicie nuevamente sesión");
            // /* localStorage.setItem('isLoggedin', 'false'); */
            return false;
        }
        return true;
    }
}