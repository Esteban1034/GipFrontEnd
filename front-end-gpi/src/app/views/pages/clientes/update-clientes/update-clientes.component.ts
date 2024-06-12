import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../../../service/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EstadoClienteService } from '../../../../service/estado-cliente.service';
import { EstadoCliente } from 'src/app/Model/estado-cliente';
import { SectorCliente } from 'src/app/Model/sector-cliente';
import { SectorClienteService } from '../../../../service/sector-cliente.service';
import { EmpleadoService } from '../../../../service/empleado.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Cliente } from 'src/app/model/cliente';
import { Empleado } from 'src/app/model/empleado';

@Component({
    selector: 'app-update-clientes',
    templateUrl: './update-clientes.component.html',
    styleUrls: ['./update-clientes.component.scss']
})
export class UpdateClientesComponent implements OnInit {

    errorMsj = '';
    errorMsj1 = '';
    errorMsj2 = '';
    id: number;
    cliente: Cliente = new Cliente();
    estados: EstadoCliente[];
    sectores: SectorCliente[];
    directores: Empleado[];

    form: FormGroup;
    submitted: boolean = false;

    constructor(private clienteService: ClienteService,
        private estadoService: EstadoClienteService,
        private route: ActivatedRoute,
        private router: Router,
        private sectorService: SectorClienteService,
        private empleadoService: EmpleadoService,
        private toastr: ToastrService,
        private formBuilder: FormBuilder) {

    }

    session = localStorage.getItem('session');

    ngOnInit(): void {
        this.session = JSON.parse(this.session);

        this.id = this.route.snapshot.params['id'];

        this.clienteService.getClienteById(this.id).subscribe(data => {
            this.cliente = data;
        }, error => {
            console.log(error);
            this.toastr.error(error.error.message);
            if (!this.cliente.hasOwnProperty('id')) {
                this.router.navigate(['clientes']);
            }
        });

        this.estadoService.getEstadosList().subscribe(data => {
            this.estados = data;
        }, error => console.log(error));

        this.sectorService.getSectoresList().subscribe(data => {
            this.sectores = data;
        }, error => console.log(error));

        this.empleadoService.getDirectores().subscribe(data => {
            this.directores = data;
        }, error => console.log(error));

        this.buildForm();
    }

    get f() { return this.form.controls; }

    private buildForm() {
        this.form = this.formBuilder.group({
            nomenclatura: ['', [
                Validators.required,
                Validators.maxLength(6),
                Validators.minLength(2),
                Validators.pattern('[áéíóúñÁÉÍÓÚÑ,A-Za-z]{2,6}')]],
            nombre: ['', [
                Validators.required,
                Validators.maxLength(50),
                Validators.minLength(2),
                Validators.pattern('[áéíóúñÁÉÍÓÚÑ.,A-Za-z ]{2,50}')]],
            nit: [''],
            sector: ['', Validators.required],
            gerenteCuenta: ['', Validators.required],
            estado: ['', Validators.required]
        });
    }

    onSubmit() {
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }
        this.showSpinner();
        this.updateCliente();
    }

    updateCliente() {
        this.clienteService.updateCliente(this.id, this.cliente).subscribe(data => {
            this.toastr.info('Cliente actualizado correctamente!');
            this.goToClienteList();
        }, error => {
            this.hideSpinner();
            console.log(error);
            this.toastr.error(error.error.message);
            if (error.error.message == "Código existente") {
                this.errorMsj = error.error.message;
            } else if (error.error.message == "Nomenclatura existente") {
                this.errorMsj1 = error.error.message;
            } else {
                this.errorMsj2 = error.error.message;
            }

        });
    }

    goToClienteList() {
        this.router.navigate(['/clientes']);
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
