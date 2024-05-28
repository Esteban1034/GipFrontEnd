import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from '../../../../service/cliente.service';
import { EstadoClienteService } from '../../../../service/estado-cliente.service';
import { EstadoCliente } from 'src/app/Model/estado-cliente';
import { SectorClienteService } from '../../../../service/sector-cliente.service';
import { SectorCliente } from 'src/app/Model/sector-cliente';
import { EmpleadoService } from 'src/app/service/empleado.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Cliente } from 'src/app/model/cliente';
import { Empleado } from 'src/app/model/empleado';
import { AuthService } from 'src/app/service/auth.service';

@Component({
    selector: 'app-form-clientes',
    templateUrl: './form-clientes.component.html',
    styleUrls: ['./form-clientes.component.scss']
})
export class FormClientesComponent implements OnInit {

    cliente: Cliente = new Cliente();
    estados: EstadoCliente[] = [];
    sectores: SectorCliente[] = [];
    directores: Empleado[] = [];

    form: FormGroup;
    submitted: boolean = false;

    constructor(private clienteService: ClienteService,
        private estadoService: EstadoClienteService,
        private sectorService: SectorClienteService,
        private empleadoService: EmpleadoService,
        private router: Router,
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
        private authService: AuthService) {
    }

    session = localStorage.getItem("session");

    ngOnInit(): void {
        this.session = JSON.parse(this.session);

        this.estadoService.getEstadosList().subscribe(data => {
            this.estados = data;
        }, error => {
            console.log(error);
            this.toastr.error(error);
        });

        this.sectorService.getSectoresList().subscribe(data => {
            this.sectores = data;
        }, error => {
            console.log(error);
            this.toastr.error(error);
        });

        this.empleadoService.getDirectores().subscribe(data => {
            this.directores = data;
        }, error => {
            console.log(error);
            this.toastr.error(error);
        });
        this.buildForm();
    }

    get f() { return this.form.controls; }

    buildForm() {
        this.form = this.formBuilder.group({
            nomenclatura: ['', [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(6),
                Validators.pattern('[áéíóúñÁÉÍÓÚÑ,A-Za-z]{2,6}')
            ]],
            nombre: ['', [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50),
                Validators.pattern('[áéíóúñÁÉÍÓÚÑ.,A-Za-z ]{2,50}')
            ]],
            nit: ['', [
                Validators.minLength(2),
                Validators.maxLength(50),
                Validators.pattern('[0-9]{2,50}')
            ]],
            sector: ['', Validators.required],
            gerenteCuenta: ['', Validators.required]
        });
    }

    saveCliente() {
        console.log(this.cliente);
        this.clienteService.createCliente(this.cliente).subscribe(data => {
            this.toastr.success('Cliente guardado correctamente!');
            this.goToClienteList();
        }, error => {
            this.hideSpinner();
            console.log(error);
            this.toastr.error(error.error);
        });
    }



    goToClienteList() {
        this.router.navigate(['/clientes']);
    }

    onSubmit() {

        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        this.showSpinner();

        this.saveCliente();

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
