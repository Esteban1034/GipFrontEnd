import { Component, OnInit, Input, ComponentFactoryResolver } from '@angular/core';
import { NgbModalConfig, NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProyectoService } from '../../../../service/proyecto.service';
import { EstadoFacturaService } from '../../../../service/estado-factura.service';
import { EstadoFactura } from 'src/app/Model/estado-factura';
import { Facturacion } from 'src/app/Model/facturacion';
import { FacturacionService } from '../../../../service/facturacion.service';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Proyecto } from 'src/app/Model/proyecto';
import * as moment from 'moment'

@Component({
    selector: 'app-programar-facturacion',
    templateUrl: './programar-facturacion.component.html',
    styleUrls: ['./programar-facturacion.component.scss'],
    providers: [NgbModalConfig, NgbModal]
})
export class ProgramarFacturacionComponent implements OnInit {

    errorMsj = '';
    idProyecto: number = undefined;
    proyecto: Proyecto = new Proyecto();
    vlrTotalPendiente: number = 0;
    vlrSinIva: number = 0;
    cobro: Facturacion = new Facturacion();
    cobroEditString: any;
    cobroEdit: Facturacion = new Facturacion();
    cobros: Facturacion[] = [];
    idToDelete: number = undefined;
    estados: EstadoFactura[] = [];
    dataSource = new MatTableDataSource();
    columnas: string[] = ['porcentaje', 'precio', 'fechaPlaneada', 'estado', 'fechaPago', 'editar', 'eliminar'];

    formNewCobro: FormGroup;
    submittedNC: boolean = false;

    formPagarCobro: FormGroup;
    submittedPC: boolean = false;

    constructor(config: NgbModalConfig,
        private modalService: NgbModal,
        private proyectoService: ProyectoService,
        private estadoFacService: EstadoFacturaService,
        private cobroService: FacturacionService,
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router) {

        config.backdrop = 'static';
        config.keyboard = false;
    }

    session = localStorage.getItem('session');

    ngOnInit(): void {

        this.session = JSON.parse(this.session);

        if (this.session['rol'] != 'ROL_GP' && this.session['rol'] != 'ROL_ADMIN' && this.session['rol'] != 'ROL_DP') {
            this.router.navigate(['/error'])
            return;
        }

        this.idProyecto = this.route.snapshot.params['id'];

        this.proyectoService.getProyectoById(this.idProyecto).subscribe(data => {
            this.proyecto = data;
        }, error => console.log(error));

        this.getCobros();

        this.estadoFacService.getEstadosList().subscribe(data => {
            this.estados = data;
        }, error => console.log(error));

        this.buildFormNewCobro();
        this.buildFormPagarCobro();
    }

    get fnc() { return this.formNewCobro.controls; }

    buildFormNewCobro() {
        this.formNewCobro = this.formBuilder.group({
            porcentaje: ['', [
                Validators.required,
                Validators.min(1),
                Validators.max(100),
                Validators.minLength(1),
                Validators.maxLength(3),
                Validators.pattern('[0-9]{1,3}')
            ]],
            fechaPlaneada: ['', [
                Validators.required
            ]]
        });
    }

    get fpc() { return this.formPagarCobro.controls; }

    buildFormPagarCobro() {
        this.formPagarCobro = this.formBuilder.group({
            valorPagado: ['', [
                Validators.required,
                Validators.min(1),
                Validators.minLength(1),
                Validators.maxLength(15),
                Validators.pattern('[0-9]{1,15}')
            ]],
            fechaPago: ['', [
                Validators.required
            ]]
        });
    }

    saveCobro() {
        this.submittedNC = true;

        if (this.formNewCobro.invalid) {
            return;
        }

        this.cobro.proyecto = this.proyecto;
        this.cobro.valorPagar = this.getCosto(this.cobro, this.proyecto);

        this.cobroService.cobrar(this.cobro).subscribe(data => {
            this.toastr.success('Cobro registrado correctamente!');
            this.cobro = new Facturacion();
            this.getCobros();
            this.submittedNC = false;
            this.modalService.dismissAll();
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
        });

    }

    calculatePrecio(cobros: Facturacion[]) {
        for (let i = 0; i < this.cobros.length; i++) {
            let costoTotal = this.proyecto.costo;
            this.cobros[i].precio = costoTotal * (this.cobros[i].porcentaje / 100);
        }
        return cobros;
    }

    calculateVlrPendiente(cobros: Facturacion[]) {
        let pendiente = 0;
        let regFacturado = 0;
        let total = this.proyecto.costo;

        if (cobros.length == 0) {
            return total;
        }

        for (let i = 0; i < cobros.length; i++) {
            if (cobros[i].estado.id == 1) {
                regFacturado += cobros[i].precio;
            }

            pendiente = total - regFacturado;
        }

        return pendiente;
    }

    getCobros() {
        this.cobroService.getCobrosByProyecto(this.idProyecto).subscribe(data => {
            this.cobros = data;
            console.log(data);
            this.calculatePrecio(this.cobros);
            this.vlrTotalPendiente = this.calculateVlrPendiente(this.calculatePrecio(this.cobros));
            this.vlrSinIva = this.calculateVlrSinIva(this.cobros);
        });
    }

    calculateVlrSinIva(cobros: Facturacion[]) {
        let total = 0;

        for (let i = 0; i < cobros.length; i++) {
            if (cobros[i].estado.id == 1) {
                total += cobros[i].precio;
            }
        }

        return total;
    }

    pagarModal(content, cobro: Facturacion) {
        this.cobroEdit = cobro;
        if (this.cobroEdit.estado.id == 1) {
            return this.toastr.error('No se puede editar el registro, está en estado Facturado');
        }
        this.modalService.open(content);
    }

    deleteModal(content, cobro: Facturacion) {
        if (cobro.estado.id == 1) {
            return this.toastr.error('No se puede eliminar el registro, está en estado Facturado');
        }
        this.modalService.open(content);
        this.idToDelete = cobro.id;
    }

    pagarCobro() {
        this.submittedPC = true;

        if (this.formPagarCobro.invalid) {
            return;
        }

        this.cobroService.pagar(this.cobroEdit).subscribe(data => {
            this.modalService.dismissAll();
            this.toastr.info('Cobro actualizado correctamente!');
            this.getCobros();
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
        });
    }

    deleteCobro() {
        this.cobroService.deleteFacturacion(this.idToDelete).subscribe(data => {
            this.idToDelete = undefined;
            this.modalService.dismissAll();
            this.getCobros();
            this.toastr.warning('Cobro eliminado correctamente!');
        }, error => {
            this.toastr.error(error.error);
            this.modalService.dismissAll();
        });
    }

    open(content) {
        this.modalService.open(content);
    }

    getCosto(cobro: Facturacion, proyecto: Proyecto) {
        let costo: number = 0;
        costo = this.proyecto.costo * (cobro.porcentaje / 100);
        if (isNaN(costo)) {
            return 0;
        }
        return costo;
    }

    addWeekdays(date, days) {
        date = moment(date);

        while (days > 0) {
            date = date.add(1, 'days');

            if (date.isoWeekday() !== 6 && date.isoWeekday() !== 7) {
                days -= 1;
            }
        }
        return date;
    }
}

