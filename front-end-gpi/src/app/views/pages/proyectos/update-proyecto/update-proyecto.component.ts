import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EstadoPropuesta } from 'src/app/Model/estado-propuesta';
import { EstadoProyecto } from 'src/app/Model/estado-proyecto';
import { EtapaProyecto } from 'src/app/Model/etapa-proyecto';
import { ClienteService } from 'src/app/service/cliente.service';
import { ComponenteDesarrolloService } from 'src/app/service/componente-desarrollo.service';
import { EmpleadoService } from 'src/app/service/empleado.service';
import { EstadoPropuestaService } from 'src/app/service/estado-propuesta.service';
import { EstadoProyectoService } from 'src/app/service/estado-proyecto.service';
import { EtapaProyetoService } from 'src/app/service/etapa-proyecto.service';
import { ProyectoService } from 'src/app/service/proyecto.service';
import { TipoProyectoService } from 'src/app/service/tipo-proyecto.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Proyecto } from 'src/app/Model/proyecto';
import { TipoProyecto } from 'src/app/Model/tipo-proyecto';
import { ComponenteDesarrollo } from 'src/app/Model/componente-desarrollo';
import { Cliente } from 'src/app/model/cliente';
import { Empleado } from 'src/app/model/empleado';

@Component({
    selector: 'app-update-proyecto',
    templateUrl: './update-proyecto.component.html',
    styleUrls: ['./update-proyecto.component.scss']
})
export class UpdateProyectoComponent implements OnInit {

    id: number;
    proyecto: Proyecto = new Proyecto();
    tipos: TipoProyecto[];
    etapas: EtapaProyecto[];
    componentes: ComponenteDesarrollo[];
    clientes: Cliente[];
    estadosPropuesta: EstadoPropuesta[];
    estadosProyectoPRP: EstadoProyecto[] = [];
    estadosProyectoCRN: EstadoProyecto[] = [];
    directoresIts: Empleado[];
    lideres: Empleado[];
    diretorClient: String;
    idToDelete: number = undefined;
    nuevoTipo: TipoProyecto = new TipoProyecto();
    nuevoCompo: ComponenteDesarrollo = new ComponenteDesarrollo();

    formProyecto: FormGroup;
    formProyectoPRP: FormGroup;
    submittedP: boolean = false;
    formTipo: FormGroup;
    submittedT: boolean = false;
    formComponente: FormGroup;
    submittedC: boolean = false;
    fecha: string;

    modalAddTipo: NgbModalRef;
    modalDeleteTipo: NgbModalRef;
    modalAddComponente: NgbModalRef;
    modalDeleteComponente: NgbModalRef;

    constructor(
        private proyectoService: ProyectoService,
        private tipoService: TipoProyectoService,
        private etapaService: EtapaProyetoService,
        private componenteService: ComponenteDesarrolloService,
        private clienteService: ClienteService,
        private estadoPropService: EstadoPropuestaService,
        private estadoProyService: EstadoProyectoService,
        private empleadoService: EmpleadoService,
        private router: Router,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private modalService: NgbModal) {

    }

    session = localStorage.getItem('session');

    ngOnInit(): void {
        this.session = JSON.parse(this.session);

        if (this.session['rol'] != 'ROL_ADMIN' && this.session['rol'] != 'ROL_GP' && this.session['rol'] != 'ROL_DP') {
            this.router.navigate(['/error']);
            return;
        }

        this.id = this.route.snapshot.params['id'];

        this.proyectoService.getProyectoById(this.id).subscribe(data => {
            this.proyecto = data;
            if (this.proyecto.etapa.etapa == 'PRP') {
                this.proyecto.componente = new ComponenteDesarrollo();
                this.proyecto.lider = new Empleado();
                this.proyecto.directorIts = new Empleado();
            }
        }, error => {
            console.log(error);
            this.toastr.error(error.error.message);
            if (!this.proyecto.hasOwnProperty('id')) {
                this.router.navigate(['proyectos']);
            }
        });

        this.getTipos();
        this.getEtapas();
        this.getComponentes();
        this.getClientes();
        this.getEstadosProp();
        this.getEstadosProyectoCRN();
        this.getEstadosProyectoPRP();
        this.getDirectoresIts();
        this.getLideres();

        this.buildFormProyecto();
        this.buildFormProyectoPRP();
        this.buildFormTipo();
        this.buildFormComponent();
    }

    onSubmit() {
        this.submittedP = true;

        if (this.formProyectoPRP.invalid && this.proyecto.etapa.id == 1) {
            return;
        }

        if (this.formProyecto.invalid && this.proyecto.etapa.id == 2) {
            return;
        }
        this.showSpinner();
        this.updateProyecto();

    }

    updateProyecto() {
        this.proyectoService.updateProyecto(this.id, this.proyecto, this.session['id']).subscribe(data => {
            this.toastr.success('¡Proyecto actualizado correctamente!');
            this.goToProyectList();
        }, error => {
            this.hideSpinner();
            console.log(error);
            this.toastr.error(error.error);
        });
    }

    get fp() { return this.formProyecto.controls; }

    buildFormProyecto() {
        this.formProyecto = this.formBuilder.group({
            cliente: ['', [
                Validators.required
            ]],
            codigo: ['', [
                Validators.required,
                Validators.maxLength(10),
                Validators.pattern('[0-9]{1,10}')
            ]],
            etapa: ['', [
                Validators.required
            ]],
            tipo: ['', [
                Validators.required
            ]],
            estadoPropuesta: ['', [
                Validators.required
            ]],
            horasPlaneadas: ['', [
                Validators.required,
                Validators.pattern('[0-9]{1,5}')
            ]],
            costo: ['', [
                Validators.required,
                Validators.pattern('[0-9, .]{1,12}')
            ]],
            componente: ['', [
                Validators.required
            ]],
            lider: ['', [
                Validators.required
            ]],
            estadoProyecto: ['', [
                Validators.required
            ]],
            fechaAprobacion: ['', [
                Validators.required
            ]],
            fechaInicio: ['', [
                Validators.required
            ]],
            fechaFin: ['',],
            directorClient: ['',],
            directorIts: ['', [
                Validators.required
            ]],
            descripcion: ['', [
                Validators.required,
                Validators.maxLength(60)
            ]]
        });
    }

    get fpPRP() { return this.formProyectoPRP.controls; }

    buildFormProyectoPRP() {
        this.formProyectoPRP = this.formBuilder.group({
            cliente: ['', [
                Validators.required
            ]],
            codigo: ['', [
                Validators.required,
                Validators.maxLength(10),
                Validators.pattern('[0-9]{1,10}')
            ]],
            etapa: ['', [
                Validators.required
            ]],
            tipo: ['', [
                Validators.required
            ]],
            estadoPropuesta: ['', [
                Validators.required
            ]],
            estadoProyecto: ['', [
                Validators.required
            ]],
            descripcion: ['', [
                Validators.required,
                Validators.maxLength(60)
            ]]
        });
    }

    get ft() { return this.formTipo.controls; }

    buildFormTipo() {
        this.formTipo = this.formBuilder.group({
            tipo: ['', [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(15),
                Validators.pattern('[A-Z ]{2,15}')
            ]]
        });
    }

    get fc() { return this.formComponente.controls; }

    buildFormComponent() {
        this.formComponente = this.formBuilder.group({
            componente: ['', [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(15)
            ]]
        });
    }

    saveTipo() {
        this.submittedT = true;

        if (this.formTipo.invalid) {
            return;
        }

        this.tipoService.createTipo(this.nuevoTipo).subscribe(data => {
            this.toastr.success('Tipo guardado correctamente!');
            this.modalService.dismissAll();
            this.nuevoTipo = new TipoProyecto();

            this.tipoService.getTiposList().subscribe(data => {
                this.tipos = data;
            }, error => console.log(error));
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
        });
    }

    removeTipo() {
        this.tipoService.deleteTipo(this.idToDelete).subscribe(data => {
            console.log(data);
            this.idToDelete = undefined;
            this.modalDeleteTipo.close();
            this.toastr.warning('Tipo eliminado correctamente!');

            this.tipoService.getTiposList().subscribe(data => {
                this.tipos = data;
            }, error => console.log(error));
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
            this.modalDeleteTipo.close();
        });
    }

    saveComponente() {
        this.submittedC = true;

        if (this.formComponente.invalid) {
            return;
        }

        this.componenteService.createComponente(this.nuevoCompo).subscribe(data => {
            this.toastr.success('Componente guardado correctamente!');
            this.modalService.dismissAll();
            this.nuevoCompo = new ComponenteDesarrollo();

            this.componenteService.getComponentesList().subscribe(data => {
                this.componentes = data;
            }, error => console.log(error));
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
        });
    }

    removeComponente() {
        this.componenteService.deleteComponente(this.idToDelete).subscribe(data => {
            console.log(data);
            this.idToDelete = undefined;
            this.modalService.dismissAll();
            this.toastr.warning('Componente eliminado correctamente!');

            this.componenteService.getComponentesList().subscribe(data => {
                this.componentes = data;
            }, error => console.log(error));
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
            this.modalDeleteComponente.close();
        });
    }

    goToProyectList() {
        this.router.navigate(['/proyectos']);
    }

    openAddTipoModal(content) {
        this.modalAddTipo = this.modalService.open(content);
    }

    getNombreConcat() {
        if (this.proyecto.etapa == null || this.proyecto.cliente == null || this.proyecto.codigo == null) {
            return "REG - ETAPA - CLIENTE - CODIGO";
        }
        else if (this.proyecto.etapa.id == 1) {

            return 'REG-' + "PRP" + "-" + this.proyecto.cliente.nomenclatura + "-" + this.proyecto.codigo;
        }
        else if (this.proyecto.etapa.id == 2) {

            return 'REG-' + "CRN" + "-" + this.proyecto.cliente.nomenclatura + "-" + this.proyecto.codigo;
        }

        //return 'REG-' +  + "-" + this.proyecto.cliente.nomenclatura + "-" + this.proyecto.codigo;
    }

    closeAddTipoModal() {
        this.modalAddTipo.close();
    }

    openRemoveTipoModal(content, id: number) {
        this.modalDeleteTipo = this.modalService.open(content);
        this.idToDelete = id;
    }

    closeRemoveTipoModal() {
        this.modalDeleteTipo.close();
    }

    openAddComponenteModal(content) {
        this.modalAddComponente = this.modalService.open(content);
    }

    closeAddComponenteModal() {
        this.modalAddComponente.close()
    }

    openRemoveComponenteModal(content, id: number) {
        this.modalDeleteComponente = this.modalService.open(content);
        this.idToDelete = id;
    }

    closeRemoveComponenteModal() {
        this.modalDeleteComponente.close();
    }

    getEstadosProyectoPRP() {
        this.estadoProyService.getEstadosList().subscribe(data => {
            data.forEach(estado => {
                if (estado.estado === 'LEVANTAMIENTO DEL REQUERIMIENTO' || estado.estado === 'CONSTRUCCIÓN DE PROPUESTA' || estado.estado === 'PENDIENTE DE APROBACIÓN' || estado.estado === 'ANÁLISIS REQUERIMIENTO CLIENTE' || estado.estado === 'CERRADO' || estado.estado === 'CANCELADO') {
                    this.estadosProyectoPRP.push(estado);
                }
            });
        }, error => {
            console.log(error);
        });
    }

    getEstadosProyectoCRN() {
        this.estadoProyService.getEstadosList().subscribe(data => {
            data.forEach(estado => {
                if (estado.estado === 'PLANEACIÓN' || estado.estado === 'EJECUCIÓN' || estado.estado === 'FINALIZADO' || estado.estado === 'CERRADO' || estado.estado === 'CANCELADO') {
                    this.estadosProyectoCRN.push(estado);
                }
            });
        }, error => {
            console.log(error);
        });
    }

    getTipos() {
        this.tipoService.getTiposList().subscribe(data => {
            this.tipos = data;
        }, error => {
            console.log(error);
            this.toastr.error(error);
        });
    }

    getEtapas() {
        this.etapaService.getEtapasList().subscribe(data => {
            this.etapas = data;
        }, error => {
            console.log(error);
            this.toastr.error(error);
        });
    }

    getComponentes() {
        this.componenteService.getComponentesList().subscribe(data => {
            this.componentes = data;
        }, error => {
            console.log(error);
            this.toastr.error(error);
        });
    }

    getClientes() {
        this.clienteService.getClientesList().subscribe(data => {
            this.clientes = data;
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
        });
    }

    getEstadosProp() {
        this.estadoPropService.getEstadosList().subscribe(data => {
            this.estadosPropuesta = data;
        }, error => {
            console.log(error);
            this.toastr.error(error);
        });
    }

    getDirectoresIts() {
        this.empleadoService.getDirectorIts().subscribe(data => {
            this.directoresIts = data;
        }, error => {
            console.log(error);
            this.toastr.error(error);
        });
    }


    getLideres() {
        this.empleadoService.getLideres().subscribe(data => {
            this.lideres = data;
        }, error => {
            console.log(error);
            this.toastr.error(error);
        });
    }

    showSpinner() {
        document.getElementById('con_spinner').style.display = 'block';
        document.getElementById('con_spinner').style.opacity = '100';
        document.getElementById('occ').style.display = 'none';
    }

    hideSpinner() {
        document.getElementById('con_spinner').style.display = 'none';
        document.getElementById('con_spinner').style.opacity = '0';
        document.getElementById('occ').style.display = 'block';
    }

}
