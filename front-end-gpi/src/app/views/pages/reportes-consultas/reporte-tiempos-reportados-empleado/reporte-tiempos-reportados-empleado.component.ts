import { Component, OnInit } from "@angular/core";
import { Empleado } from "src/app/model/empleado";
import { EmpleadoService } from "src/app/service/empleado.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ReporteAppService } from "../../../../service/reporte.app.service";
import { ReporteTiempoEmpleado } from "src/app/model/reporte-tiempo-empleado";
import * as XLSX from "xlsx";
import { ToastrService } from "ngx-toastr";
import { ReporteTiempoEmpleadoResumido } from "../../../../model/reporte-tiempo-empleado";
import { Router } from "@angular/router";
import { EstadoEmpleado } from "src/app/model/estado-empleado";
import { EstadoEmpleadoService } from "src/app/service/estado-empleado.service";

@Component({
  selector: "app-reporte-tiempos-reportados-empleado",
  templateUrl: "./reporte-tiempos-reportados-empleado.component.html",
  styleUrls: ["./reporte-tiempos-reportados-empleado.component.scss"],
})
export class ReporteTiemposReportadosEmpleadoComponent implements OnInit {
  reportes: ReporteTiempoEmpleado[] = [];
  reportesResumidos: ReporteTiempoEmpleadoResumido[] = [];
  addRecursosModal: NgbModalRef;
  recursos: Empleado[] = [];
  recursosAgregados: Empleado[] = [];
  form: FormGroup;
  submitted: boolean = false;
  errorMsj: string = "";
  recursoFiltro: any[];
  searchTextR: string = "";
  nombresR: Empleado[];

  constructor(
    private empleadoService: EmpleadoService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private reporteService: ReporteAppService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  session = localStorage.getItem("session");

  ngOnInit(): void {
    this.session = JSON.parse(this.session);

    this.getRecursos();
    this.buildForm();
  }

  validarText(event: KeyboardEvent) {
    const codigoTecla = event.keyCode;
    if (
      (codigoTecla < 65 || codigoTecla > 90) &&
      codigoTecla !== 8 &&
      codigoTecla !== 9
    ) {
      event.preventDefault();
    }
  }

  filtroRecursosDispo() {
    if (this.searchTextR.trim() === "") {
      this.recursoFiltro = this.recursos;
    } else {
      this.recursoFiltro = this.recursos.filter((recurso) => {
        return recurso.nombre
          .toLowerCase()
          .includes(this.searchTextR.toLowerCase());
      });
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      fechaInicio: ["", [Validators.required]],
      fechaFin: ["", [Validators.required]],
    });
  }

  get f() {
    return this.form.controls;
  }

  getRecursos() {
    this.empleadoService.getEmpleadosList().subscribe((data) => {
      data.sort((a, b) => (a.nombre < b.nombre ? -1 : 1));
      this.recursos = data;
      this.recursoFiltro = data;
    });
  }

  openAddRecursosModal(content) {
    this.addRecursosModal = this.modalService.open(content, {
      size: "lg",
      scrollable: true,
    });
  }

  closeAddRecursosModal() {
    this.addRecursosModal.close();
  }

  agregarRecurso(empleado: Empleado) {
    this.recursoFiltro.forEach((emp, index) => {
      if (emp.id == empleado.id) this.recursoFiltro.splice(index, 1);
    });

    this.recursosAgregados.push(empleado);
    this.recursosAgregados = this.recursosAgregados.sort((a, b) =>
      a.nombre < b.nombre ? -1 : 1
    );
  }

  quitarRecurso(empleado: Empleado) {
    this.recursosAgregados.forEach((emp, index) => {
      if (emp.id == empleado.id) {
        this.recursosAgregados.splice(index, 1);
        this.recursoFiltro.push(emp);
      }
    });
  }

  seleccionarTodo() {
    this.recursoFiltro.forEach((recurs) => {
      this.recursosAgregados.push(recurs);
    });
    this.recursoFiltro = [];
  }

  quitarTodo() {
    this.recursosAgregados = [];
    this.filtroRecursosDispo();
  }

  cancelarAgregarRecurso() {
    this.quitarRecursos();
    (<HTMLInputElement>document.getElementById("fechaInicio")).value = null;
    (<HTMLInputElement>document.getElementById("fechaFin")).value = null;
    this.reportes = [];
  }

  cancelAgregarRecursoModal() {
    this.closeAddRecursosModal();
    this.recursosAgregados = [];
    this.getRecursos();
  }

  aceptarAgregarRecursoModal() {
    if (this.recursosAgregados.length == 0) {
      return;
    }
    this.closeAddRecursosModal();
  }

  quitarRecursos() {
    this.recursosAgregados = [];
    this.getRecursos();
  }

  exportExcelReporteCompleto() {
    let element = document.getElementById("table-reportes-completos");

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    let fileName = "reporte_tiempos_reportados_empleado_completo.xlsx";

    XLSX.utils.book_append_sheet(wb, ws, "Tiempos Reportados");
    XLSX.writeFile(wb, fileName);
  }

  exportExcelReporteResumido() {
    let element = document.getElementById("table-reportes-resumidos");

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    let fileName = "reporte_tiempos_reportados_empleado_resumido.xlsx";

    XLSX.utils.book_append_sheet(wb, ws, "Tiempos Reportados");
    XLSX.writeFile(wb, fileName);
  }

  search() {
    this.errorMsj = null;
    this.reportes = [];
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    let fechaI = (<HTMLInputElement>document.getElementById("fechaInicio"))
      .value;
    let fechaF = (<HTMLInputElement>document.getElementById("fechaFin")).value;

    let fechaInicio = new Date(fechaI);
    let fechaFin = new Date(fechaF);

    fechaInicio.setDate(fechaInicio.getDate() + 1);
    fechaFin.setDate(fechaFin.getDate() + 1);

    if (fechaInicio.getTime() > fechaFin.getTime()) {
      return (this.errorMsj =
        "La fecha Inicio no debe ser mayor a la fecha Fin.");
    }

    if (this.recursosAgregados.length == 0) {
      return (this.errorMsj = "Se deben agregar recursos a la busqueda.");
    }

    let empleados: string = "";
    this.recursosAgregados.forEach((recurso) => {
      empleados += recurso.id.toString() + ",";
    });

    this.reporteService
      .findAllReportesTiemposReportados(fechaI, fechaF, empleados)
      .subscribe(
        (data) => {
          this.reportes = data;
          console.log(this.reportes);

          if (this.reportes.length == 0) {
            return this.toastr.info(
              "No se encontraron resultados en la busqueda."
            );
          }

          this.reportesResumidos = [];
          this.reportes.forEach((reporte) => {
            let reporteR: ReporteTiempoEmpleadoResumido =
              new ReporteTiempoEmpleadoResumido();
            reporteR.recurso = reporte.recurso;
            reporteR.proyecto = reporte.proyecto;
            reporteR.horas = this.getTotalHrsReportadasXEmpleado(
              reporte.recurso,
              reporte.proyecto,
              this.reportes
            );

            if (!this.existsReporteResumido(reporte, this.reportesResumidos)) {
              this.reportesResumidos.push(reporteR);
            }
          });
        },
        (error) => {
          console.log(error);
        }
      );

    this.errorMsj = null;
  }

  getTotalHrsReportadasXEmpleado(
    recurso: string,
    proyecto: string,
    reportes: ReporteTiempoEmpleado[]
  ): number {
    let totalHoras = 0;
    reportes.forEach((reporte) => {
      if (reporte.recurso == recurso) {
        totalHoras += reporte.horas;
      }
    });

    return totalHoras;
  }

  existsReporteResumido(
    reporte: ReporteTiempoEmpleado,
    reportes: ReporteTiempoEmpleadoResumido[]
  ): boolean {
    let flag: boolean;
    reportes.forEach((r) => {
      if (r.recurso == reporte.recurso) {
        flag = true;
      } else {
        flag = false;
      }
    });

    if (reportes.length == 0) {
      flag = false;
    }

    return flag;
  }
}
