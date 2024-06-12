import { Component, OnInit } from '@angular/core';
import { ReporteTiempo } from 'src/app/Model/reporte-tiempo';
import { ReporteTiempoService } from 'src/app/service/reporte-tiempo.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-mis-reportes',
    templateUrl: './mis-reportes.component.html',
    styleUrls: ['./mis-reportes.component.scss']
})
export class MisReportesComponent implements OnInit {

    idRecurso:number;
    reportes:ReporteTiempo[] = [];
    idRecursoToDelete:number;
    form:FormGroup;
    submitted:boolean = false;
    fechaInicio:string = '';
    fechaFin:string = '';

    constructor(private reporteTiempoService:ReporteTiempoService,
        private formBuilder: FormBuilder,
        private toastr:ToastrService,
        private modalService:NgbModal) {

    }

    ngOnInit(): void {
        let session = localStorage.getItem('session');
        session = JSON.parse(session);
        this.idRecurso = session["id"];

        this.buildForm();
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

    getMisReportes() {
        this.reporteTiempoService.findByEmpleado(this.idRecurso).subscribe(data => {
            this.reportes = data.sort((a, b) => (a.fecha > b.fecha ? -1 : 1));
        },  error => {
            console.log(error);
        });
    }

    openDeleteModal(content, reporte:ReporteTiempo) {
        if(reporte.estado.id != 1) {
            return this.toastr.error('Este reporte no se puede eliminar, el estado debe ser PENDIENTE DE APROBACION');
        }
        this.modalService.open(content);
        this.idRecursoToDelete = reporte.id;
    }

    deleteReporte() {
        this.reporteTiempoService.deleteReporteTiempo(this.idRecursoToDelete).subscribe(data => {
            this.toastr.warning('Reporte eliminado correctamente!');
            this.getMisReportes();
            this.modalService.dismissAll();
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
        });
    }

    get f () {
        return this.form.controls;
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

        this.reporteTiempoService.getRecursosAprobacionTiempos(this.fechaInicio, this.fechaFin, this.idRecurso).subscribe(data => {
            this.reportes = data.sort((a, b) => (a.fecha > b.fecha ? -1 : 1));         
            
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
        });
    }

    cancelBotton(){
        let rep: ReporteTiempo[] = [];
        this.reportes = rep;
    }

}
