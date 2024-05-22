import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/model/cliente';
import { ComponenteDesarrollo } from 'src/app/Model/componente-desarrollo';
import { Empleado } from 'src/app/model/empleado';
import { EstadoPropuesta } from 'src/app/Model/estado-propuesta';
import { EstadoProyecto } from 'src/app/Model/estado-proyecto';
import { EtapaProyecto } from 'src/app/Model/etapa-proyecto';
import { Proyecto } from 'src/app/Model/proyecto';
import { TipoProyecto } from 'src/app/Model/tipo-proyecto';
import { ClienteService } from 'src/app/service/cliente.service';
import { ComponenteDesarrolloService } from 'src/app/service/componente-desarrollo.service';
import { EmpleadoService } from 'src/app/service/empleado.service';
import { EstadoPropuestaService } from 'src/app/service/estado-propuesta.service';
import { EstadoProyectoService } from 'src/app/service/estado-proyecto.service';
import { EtapaProyetoService } from 'src/app/service/etapa-proyecto.service';
import { ProyectoService } from 'src/app/service/proyecto.service';
import { TipoProyectoService } from 'src/app/service/tipo-proyecto.service';

@Component({
    selector: 'app-form-proyecto-int',
    templateUrl: './form-proyecto-int.component.html',
    styleUrls: ['./form-proyecto-int.component.scss']
})
export class FormProyectoIntComponent implements OnInit {

    clientes: Cliente[] = [];
    etapas: EtapaProyecto[] = [];
    tipos: TipoProyecto[] = [];
    componentes: ComponenteDesarrollo[] = [];
    estadosProp: EstadoPropuesta[] = [];
    estadosProy: EstadoProyecto[] = [];
    directoresIts: Empleado[] = [];
    lideres: Empleado[] = [];

    formNewProyecto: FormGroup;
    submittedNP: boolean = false;
    proyecto: Proyecto = new Proyecto();

    constructor(private clienteService: ClienteService,
        private etapaService: EtapaProyetoService,
        private tipoService: TipoProyectoService,
        private componenteService: ComponenteDesarrolloService,
        private estadoPropService: EstadoPropuestaService,
        private estadoProyService: EstadoProyectoService,
        private empleadoService: EmpleadoService,
        private proyectoService: ProyectoService,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private router: Router) { }

    session = localStorage.getItem('session');

    ngOnInit(): void {
        this.session = JSON.parse(this.session);

        if (this.session['rol'] != 'ROL_GP' && this.session['rol'] != 'ROL_ADMIN' && this.session['rol'] != 'ROL_DP') {
            this.router.navigate(['/error']);
        }
        this.getClientes();
        this.getEtapas();
        this.getTipos();
        this.getComponentes();
        this.getEstadosProp();
        this.getEstadosProy();
        this.getDirectoresIts();
        this.getLideres();

        this.buildFormNewProyecto();
    }

    getClientes() {
        this.clienteService.getClientesList().subscribe(data => {
            console.log(data);
            this.clientes = data;
        }, error => {
            console.log(error);
        });
    }

    getEtapas() {
        this.etapaService.getEtapasList().subscribe(data => {
            console.log(data);
            this.etapas = data;
        }, error => {
            console.log(error);
        });
    }

    getTipos() {
        this.tipoService.getTiposList().subscribe(data => {
            console.log(data);
            this.tipos = data;
        }, error => {
            console.log(error);
        });
    }

    getComponentes() {
        this.componenteService.getComponentesList().subscribe(data => {
            console.log(data);
            this.componentes = data;
        }, error => {
            console.log(error);
        });
    }

    getEstadosProp() {
        this.estadoPropService.getEstadosList().subscribe(data => {
            console.log(data);
            this.estadosProp = data;
        }, error => {
            console.log(error);
        });
    }

    getEstadosProy() {
        this.estadoProyService.getEstadosList().subscribe(data => {
            console.log(data);
            this.estadosProy = data;
        }, error => {
            console.log(error);
        });
    }

    getDirectoresIts() {
        this.empleadoService.getDirectorIts().subscribe(data => {
            console.log(data);
            this.directoresIts = data;
        }, error => {
            console.log(error);
        });
    }

    getLideres() {
        this.empleadoService.getLideres().subscribe(data => {
            console.log(data);
            this.lideres = data;
        }, error => {
            console.log(error);
        });
    }

    get fnp() {
        return this.formNewProyecto.controls;
    }

    buildFormNewProyecto() {
        this.formNewProyecto = this.formBuilder.group({
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
        this.submittedNP = true;

        if (this.formNewProyecto.invalid) {
            return;
        }

        this.showSpinner();

        this.proyecto.interno = true;
        this.proyecto.creador = this.session['nombre'];
        this.proyectoService.saveProyectoInt(this.proyecto).subscribe(data => {
            console.log(data);
            this.proyecto = new Proyecto();
            this.toastr.success('Proyecto guardado correctamente!');
            this.router.navigate(['/proyectos/internos']);
        }, error => {
            setTimeout(() => {
                this.hideSpinner();

            }, 4000);

            this.toastr.error(error.error);
            console.log(error);
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
