import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/model/cliente';
import { ClienteService } from 'src/app/service/cliente.service';
import { ReporteAppService } from 'src/app/service/reporte.app.service';
import * as XLSX from 'xlsx';
import { ReporteFacturacionCliente, ReporteFacturacionClienteResumido } from '../../../../model/reporte-facturacion-cliente';

@Component({
    selector: 'app-reporte-facturacion-cliente',
    templateUrl: './reporte-facturacion-cliente.component.html',
    styleUrls: ['./reporte-facturacion-cliente.component.scss']
})
export class ReporteFacturacionClienteComponent implements OnInit {

    reportes: ReporteFacturacionCliente[] = [];
    reportesResumidos: ReporteFacturacionClienteResumido[] = [];
    addClientesModal: NgbModalRef;
    clientes: Cliente[] = [];
    clientesAgregados: Cliente[] = [];
    form: FormGroup;
    submitted: boolean = false;
    errorMsj: string = '';

    constructor(private clienteService: ClienteService,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private reporteService: ReporteAppService,
        private toastr: ToastrService,
        private router: Router) { }

    session = localStorage.getItem('session');

    ngOnInit(): void {
        this.session = JSON.parse(this.session);

        if (this.session['rol'] != 'ROL_ADMIN' && this.session['rol'] != 'ROL_GP' && this.session['rol'] != 'ROL_DP') {
            this.router.navigate(['/error']);
            return;
        }

        this.getClientes();
        this.buildForm();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            fechaInicio: ['', [
                Validators.required,
            ]],
            fechaFin: ['', [
                Validators.required
            ]]
        });
    }

    get f() { return this.form.controls; }

    getClientes() {
        this.clienteService.getClientesList().subscribe(data => {
            data.sort((a, b) => (a.nombre < b.nombre ? -1 : 1));
            this.clientes = data;
        }, error => {
            console.log(error);
        });
    }

    openAddClientesModal(content) {
        this.addClientesModal = this.modalService.open(content, { size: 'lg', scrollable: true });
    }

    closeAddClientesModal() {
        this.addClientesModal.close();
    }

    agregarCliente(cliente: Cliente) {
        this.clientes.forEach((cli, index) => {
            if (cli.id == cliente.id) this.clientes.splice(index, 1);
        });

        this.clientesAgregados.push(cliente);
        this.clientesAgregados = this.clientesAgregados.sort((a, b) => (a.nombre < b.nombre ? -1 : 1));
    }

    quitarCliente(cliente: Cliente) {
        this.clientesAgregados.forEach((cli, index) => {
            if (cli.id == cliente.id) this.clientesAgregados.splice(index, 1);
        });

        this.clientes.push(cliente);
        this.clientes = this.clientes.sort((a, b) => (a.nombre < b.nombre ? -1 : 1));
    }

    seleccionarTodo() {
        this.clientesAgregados = [];
        this.clienteService.getClientesList().subscribe(data => {
            this.clientes = [];
            this.clientesAgregados = data.sort((a, b) => (a.nombre < b.nombre ? -1 : 1));
        }, error => {
            console.log(error);
        });
    }

    quitarTodo() {
        this.clientes = [];
        this.clienteService.getClientesList().subscribe(data => {
            this.clientesAgregados = [];
            this.clientes = data.sort((a, b) => (a.nombre < b.nombre ? -1 : 1));
        }, error => {
            console.log(error);
        });
    }

    cancelarAgregarCliente() {
        this.quitarClientes();
        (<HTMLInputElement>document.getElementById('fechaInicio')).value = null;
        (<HTMLInputElement>document.getElementById('fechaFin')).value = null;
        this.reportes = [];
        this.reportesResumidos = [];
    }

    cancelAgregarClienteModal() {
        this.closeAddClientesModal();
        this.clientesAgregados = [];
        this.getClientes();
    }

    aceptarAgregarClienteModal() {
        if (this.clientesAgregados.length == 0) {
            return;
        }
        this.closeAddClientesModal();
    }

    quitarClientes() {
        this.clientesAgregados = [];
        this.getClientes();
    }

    exportExcelReporteCompleto() {
        let element = document.getElementById('table-reportes-completos');

        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        let fileName = "reporte_facturacion_cliente_completo.xlsx";

        XLSX.utils.book_append_sheet(wb, ws, 'Facturacion Cliente');
        XLSX.writeFile(wb, fileName);
    }

    exportExcelReporteResumido() {
        let element = document.getElementById('table-reportes-resumidos');

        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        let fileName = "reporte_facturacion_cliente_resumido.xlsx";

        XLSX.utils.book_append_sheet(wb, ws, 'Facturacion Cliente');
        XLSX.writeFile(wb, fileName);
    }

    search() {
        this.errorMsj = null;
        this.reportes = [];
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        let fechaI = (<HTMLInputElement>document.getElementById('fechaInicio')).value;
        let fechaF = (<HTMLInputElement>document.getElementById('fechaFin')).value;

        let fechaInicio = new Date(fechaI);
        let fechaFin = new Date(fechaF);

        fechaInicio.setDate(fechaInicio.getDate() + 1);
        fechaFin.setDate(fechaFin.getDate() + 1);

        console.log(fechaInicio);
        console.log(fechaFin);

        if (fechaInicio.getTime() > fechaFin.getTime()) {
            return this.errorMsj = "La fecha Inicio no debe ser mayor a la fecha Fin.";
        }

        if (this.clientesAgregados.length == 0) {
            return this.errorMsj = "Se deben agregar clientes a la busqueda.";
        }

        let clientes: string = "";
        this.clientesAgregados.forEach(recurso => {
            clientes += recurso.id.toString() + ",";
        });

        this.reporteService.findAllReportesFacturacionCliente(fechaI, fechaF, clientes).subscribe(data => {
            this.reportes = data;

            if (this.reportes.length == 0) {
                return this.toastr.info("No se encontraron resultados en la busqueda.");
            }

            this.reportesResumidos = [];
            this.reportes.forEach(reporte => {
                let reporteR: ReporteFacturacionClienteResumido = new ReporteFacturacionClienteResumido();
                reporteR.cliente = reporte.cliente;
                reporteR.descripcion = reporte.descripcion;
                reporteR.proyecto = reporte.proyecto;
                reporteR.nPagos = reporte.nPagos;
                reporteR.facturasPagas = reporte.facturasPagas;
                reporteR.facturasPendientes = reporte.facturasPendientes;
                reporteR.valorAprobado = reporte.valorAprobado;
                reporteR.valorCobrado = reporte.valorCobrado;

                for (let i = 0; i < this.reportesResumidos.length; i++) {
                    if (reporteR.proyecto == this.reportesResumidos[i].proyecto) {
                        this.reportesResumidos.splice(i, 1);
                    }
                }
                console.log(data);

                this.reportesResumidos.push(reporteR);
            });
        }, error => {

            console.log(error);
        });
        console.log(this.reportesResumidos);
        this.errorMsj = null;
    }


}
