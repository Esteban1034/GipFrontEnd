import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReporteAppService } from 'src/app/service/reporte.app.service';
import { ToastrService } from 'ngx-toastr';
import { ReporteTiempo } from 'src/app/Model/reporte-tiempo';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-reporte-tiempos-pendientes-empleados',
    templateUrl: './reporte-tiempos-pendientes-empleados.component.html',
    styleUrls: ['./reporte-tiempos-pendientes-empleados.component.scss']
})
export class ReporteTiemposPendientesEmpleadosComponent implements OnInit {

    reportes:ReporteTiempo[] = [];
    fechaInicio:string = '';
    fechaFin:string = '';

    form:FormGroup;
    submitted:boolean = false;

    constructor(private formBuilder: FormBuilder,
        private reporteAppService: ReporteAppService,
        private toastr: ToastrService) { }

    ngOnInit(): void {
        this.buildForm();
    }

    get f () {
        return this.form.controls;
    }

    buildForm() {
        this.form = this.formBuilder.group({
            fechaInicio: ['', [
                Validators.required
            ]], 
            fechaFin: ['', [
                Validators.required
            ]]
        });
    }

    search() {
        this.submitted = true;

        if(this.form.invalid) {
            return;
        }

        let fechaI:Date = new Date(this.fechaInicio);
        let fechaF:Date = new Date(this.fechaFin);

        fechaI.setDate(fechaI.getDate() + 1);
        fechaF.setDate(fechaF.getDate() + 1);

        if(fechaI.getTime() > fechaF.getTime() ) {
            return this.toastr.error('La fecha inicio debe ser menor a la fecha de fin.');
        }

        this.reporteAppService.getEmpleadosPendientesReporteTiempo(this.fechaInicio, this.fechaFin).subscribe(data => {
            this.reportes = data;
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
        });
    }

    exportExcel() {
        let element = document.getElementById('table-reportes');

        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        let fileName = "reporte_tiempos_pendientes_empleado.xlsx";

        XLSX.utils.book_append_sheet(wb, ws, 'Reportes pendientes');
        XLSX.writeFile(wb, fileName);
    }

}
