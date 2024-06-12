import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Actividad } from 'src/app/Model/actividad';
import { Cliente } from 'src/app/model/cliente';
import { ComponenteDesarrollo } from 'src/app/Model/componente-desarrollo';
import { Empleado } from 'src/app/model/empleado';
import { EstadoPropuesta } from 'src/app/Model/estado-propuesta';
import { EstadoProyecto } from 'src/app/Model/estado-proyecto';
import { EtapaProyecto } from 'src/app/Model/etapa-proyecto';
import { FaseProyecto } from 'src/app/Model/fase-proyecto';
import { Proyecto } from 'src/app/Model/proyecto';
import { TipoProyecto } from 'src/app/Model/tipo-proyecto';
import { ActividadService } from 'src/app/service/actividad.service';
import { ClienteService } from 'src/app/service/cliente.service';
import { ComponenteDesarrolloService } from 'src/app/service/componente-desarrollo.service';
import { EmpleadoService } from 'src/app/service/empleado.service';
import { EstadoPropuestaService } from 'src/app/service/estado-propuesta.service';
import { EstadoProyectoService } from 'src/app/service/estado-proyecto.service';
import { EtapaProyetoService } from 'src/app/service/etapa-proyecto.service';
import { FaseProyectoService } from 'src/app/service/fase-proyecto.service';
import { ProyectoService } from 'src/app/service/proyecto.service';
import { TipoProyectoService } from 'src/app/service/tipo-proyecto.service';

@Component({
    selector: 'app-update-proyecto-int',
    templateUrl: './update-proyecto-int.component.html',
    styleUrls: ['./update-proyecto-int.component.scss']
})
export class UpdateProyectoIntComponent implements OnInit {

    clientes: Cliente[] = [];
    etapas: EtapaProyecto[] = [];
    tipos: TipoProyecto[] = [];
    componentes: ComponenteDesarrollo[] = [];
    estadosProp: EstadoPropuesta[] = [];
    estadosProy: EstadoProyecto[] = [];
    directoresIts: Empleado[] = [];
    lideres: Empleado[] = [];
    formNewActividad: FormGroup;
    newActividad: Actividad = new Actividad();
    fases: FaseProyecto[] = [];

    id: number;
    submittedNA: boolean = false;
    idProyecto: number = undefined;
    idActividad: number = undefined;
    formEditProyecto: FormGroup;
    submittedEP: boolean = false;
    proyecto: Proyecto = new Proyecto();

    constructor(private clienteService: ClienteService,
        private modalService: NgbModal,
        private etapaService: EtapaProyetoService,
        private tipoService: TipoProyectoService,
        private componenteService: ComponenteDesarrolloService,
        private estadoPropService: EstadoPropuestaService,
        private estadoProyService: EstadoProyectoService,
        private empleadoService: EmpleadoService,
        private proyectoService: ProyectoService,
        private actividadService: ActividadService,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private faseService: FaseProyectoService,
        private router: Router,
        private route: ActivatedRoute) { }

    session = localStorage.getItem('session');

    ngOnInit(): void {
        this.session = JSON.parse(this.session);

        this.idProyecto = this.route.snapshot.params['id'];


        this.getClientes();
        this.getEtapas();
        this.getTipos();
        this.getComponentes();
        this.getEstadosProp();
        this.getEstadosProy();
        this.getDirectoresIts();
        this.getLideres();
        this.getFases();

        this.id = this.route.snapshot.params['id'];
        this.getProyecto();

        this.buildFormEditProyecto();
        this.buildFormNewActividad();
    }

    getProyecto() {
        this.proyectoService.getProyectoById(this.id).subscribe(data => {
            if (data == null) {
                this.router.navigate(['/proyectos/internos']);
            }
            this.proyecto = data;
        }, error => {
            console.log(error);
        });
    }

    getClientes() {
        this.clienteService.getClientesList().subscribe(data => {
            this.clientes = data;
        }, error => {
            console.log(error);
        });
    }

    getEtapas() {
        this.etapaService.getEtapasList().subscribe(data => {
            this.etapas = data;
        }, error => {
            console.log(error);
        });
    }

    getTipos() {
        this.tipoService.getTiposList().subscribe(data => {
            this.tipos = data;
        }, error => {
            console.log(error);
        });
    }

    getComponentes() {
        this.componenteService.getComponentesList().subscribe(data => {
            this.componentes = data;
        }, error => {
            console.log(error);
        });
    }

    getEstadosProp() {
        this.estadoPropService.getEstadosList().subscribe(data => {
            this.estadosProp = data;
        }, error => {
            console.log(error);
        });
    }

    getEstadosProy() {
        this.estadoProyService.getEstadosList().subscribe(data => {
            this.estadosProy = data;
        }, error => {
            console.log(error);
        });
    }

    getDirectoresIts() {
        this.empleadoService.getDirectorIts().subscribe(data => {
            this.directoresIts = data;
        }, error => {
            console.log(error);
        });
    }

    getLideres() {
        this.empleadoService.getLideres().subscribe(data => {
            this.lideres = data;
        }, error => {
            console.log(error);
        });
    }

    get fep() {
        return this.formEditProyecto.controls;
    }

    buildFormEditProyecto() {
        this.formEditProyecto = this.formBuilder.group({
            codigo: ['', [
                Validators.required,
                Validators.maxLength(10),
                Validators.pattern('[0-9]{1,10}')
            ]],
            cliente: ['', [
                Validators.required
            ]],
            etapa: ['', [
                Validators.required
            ]],
            fechaAprobacion: ['', [
                Validators.required
            ]],
            fechaInicio: ['', [
                Validators.required
            ]],
            fechaFin: ['', [
                Validators.required
            ]],
            tipo: ['', [
                Validators.required
            ]],
            componente: ['', [
                Validators.required
            ]],
            estadoProp: ['', [
                Validators.required
            ]],
            estadoProy: ['', [
                Validators.required
            ]],
            directorIts: ['', [
                Validators.required
            ]],
            lider: ['', [
                Validators.required
            ]],
            descripcion: ['', [
                Validators.required,
                Validators.maxLength(60)
            ]]
        });
    }

    guardarProyecto() {
        if (this.formEditProyecto.invalid) {
            return;
        }

        document.getElementById('con_spinner').style.display = 'block';
        document.getElementById('con_spinner').style.opacity = '100';
        document.getElementById('occ').style.display = 'none';
        this.submittedEP = true;

        this.proyectoService.updateProyectoInt(this.proyecto.id, this.proyecto).subscribe(data => {
            this.proyecto = new Proyecto();
            this.toastr.info('Proyecto actualizado correctamente!');
            this.router.navigate(['/proyectos/internos']);
        }, error => {

            document.getElementById('con_spinner').style.display = 'none';
            document.getElementById('con_spinner').style.opacity = '0';
            document.getElementById('occ').style.display = 'block';
            this.toastr.error(error.error);
            console.log(error);
        });
    }

    open(content) {
        this.modalService.open(content);
    }

    goToAdminActividades() {
        this.modalService.dismissAll();
        this.router.navigate(['/proyectos/admon/actividades']);
    }

    getFases() {
        this.proyectoService.getProyectoById(this.idProyecto).subscribe(data => {

            this.proyecto = data;
            if ((this.proyecto.etapa.etapa === 'CRN' || this.proyecto.etapa.etapa === 'PRP') && this.proyecto.interno == true) {
                this.faseService.getFases().subscribe(data => {
                    data.forEach(fase => {
                        if (fase.fase === 'PROYECTOS INTERNOS') {
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

    saveActividad() {
        this.submittedNA = true;

        if (this.formNewActividad.invalid) {
            return;
        }

        this.newActividad.base = false;
        this.newActividad.proyecto = this.proyecto;
        this.actividadService.createActividad(this.newActividad).subscribe(data => {
            this.modalService.dismissAll();
            this.toastr.success('Se ha guardado la actividad correctamente');
            this.newActividad = new Actividad();
        }, error => {
            this.toastr.error(error.error);
        });
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

    get fna() {
        return this.formNewActividad.controls;
    }

}
