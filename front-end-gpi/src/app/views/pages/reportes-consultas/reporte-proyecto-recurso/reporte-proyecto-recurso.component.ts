import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Cliente } from "src/app/model/cliente";
import { EstadoProyecto } from "src/app/Model/estado-proyecto";
import { Proyecto } from "src/app/Model/proyecto";
import { ReporteFacturacionCliente } from "src/app/model/reporte-facturacion-cliente";
import { ReporteProyectoRecurso } from "src/app/model/reporte-proyecto-recurso";
import { ClienteService } from "src/app/service/cliente.service";
import { EstadoProyectoService } from "src/app/service/estado-proyecto.service";
import { ProyectoService } from "src/app/service/proyecto.service";
import { ReporteAppService } from "src/app/service/reporte.app.service";
import * as XLSX from "xlsx";

@Component({
  selector: "app-reporte-proyecto-recurso",
  templateUrl: "./reporte-proyecto-recurso.component.html",
  styleUrls: ["./reporte-proyecto-recurso.component.scss"],
})
export class ReporteProyectoRecursoComponent implements OnInit {
  reportes: ReporteProyectoRecurso[] = [];
  addProyectosModal: NgbModalRef;
  proyectos: Proyecto[] = [];
  proyectosAll: Proyecto[] = [];
  proyectosAgregados: Proyecto[] = [];
  form: FormGroup;
  submitted: boolean = false;
  errorMsj: string = "";
  proyectosFiltro: any[];
  estadoSelect: EstadoProyecto;
  estados: EstadoProyecto[];

  constructor(
    private proyectoService: ProyectoService,
    private estadoProyectoService: EstadoProyectoService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private reporteService: ReporteAppService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  session = localStorage.getItem("session");

  ngOnInit(): void {
    this.session = JSON.parse(this.session);

    this.getProyectos();
    this.buildForm();
  }

  filtroProyectosDispo() {
    if (!this.estadoSelect) {
      //this.proyectos = this.proyectosAll;
    } else {
      this.proyectos = [];
      this.proyectosAll.forEach((proyecto) => {
        if (proyecto.estadoProyecto.id == this.estadoSelect.id) {
          this.proyectos.push(proyecto);
        }
      });
    }
    this.proyectosAgregados.forEach((i) => {
      this.proyectos.forEach((j, index) => {
        if (i.id == j.id) {
          this.proyectos.splice(index, 1);
        }
      });
    });
  }

  getEstados() {
    this.estados = [];
    let estadoMap: EstadoProyecto[] = [];
    this.proyectosAll.forEach(
      (proyectos) => {
        var itemEstado = {
          id: proyectos.estadoProyecto.id,
          estado: proyectos.estadoProyecto.estado,
        };
        estadoMap.forEach((estado, index) => {
          if (estado.id == itemEstado.id) estadoMap.splice(index, 1);
        });
        estadoMap.push(itemEstado);
      },
      (error) => console.log(error)
    );
    this.estados = estadoMap;
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

  isProyectoActivo(proyec: Proyecto) {
    let result = true;
    if (
      proyec.estadoPropuesta.estado === "CANCELADO" ||
      proyec.estadoPropuesta.estado === "CERRADO" ||
      proyec.estadoProyecto.estado === "CANCELADO" ||
      proyec.estadoProyecto.estado === "CERRADO"
    ) {
      result = false;
    }
    return result;
  }

  getProyectos() {
    this.proyectosAll = [];
    this.proyectoService.getProyectosList().subscribe((data) => {
      data.sort((a, b) => (a.nombre < b.nombre ? -1 : 1));
      data.forEach((proyec) => {
        if (this.isProyectoActivo(proyec)) this.proyectos.push(proyec);
      });
      this.proyectosAll = this.proyectos;
    });
  }

  openAddProyectosModal(content) {
    this.addProyectosModal = this.modalService.open(content, {
      size: "lg",
      scrollable: true,
    });
    this.getEstados();
  }

  closeAddProyectosModal() {
    this.addProyectosModal.close();
    this.proyectos = this.proyectosAll;
  }

  agregarProyecto(proyecto: Proyecto) {
    this.proyectos.forEach((pro, index) => {
      if (pro.id == proyecto.id) this.proyectos.splice(index, 1);
    });
    this.proyectosAgregados.push(proyecto);
    this.proyectosAgregados.sort((a, b) => (a.nombre < b.nombre ? -1 : 1));
  }

  quitarProyecto(proyecto: Proyecto) {
    this.proyectosAgregados.forEach((pro, index) => {
      if (pro.id == proyecto.id) {
        this.proyectosAgregados.splice(index, 1);
        this.proyectos.push(pro);
      };
    });
    //this.filtroProyectosDispo();
    //this.proyectos.push(proyecto);
    //this.proyectosAll.sort((a, b) => (a.nombre < b.nombre ? -1 : 1));
  }

  seleccionarTodo() {
    this.proyectos.forEach((proyec, index) => {
      if (this.isProyectoActivo(proyec)) this.proyectosAgregados.push(proyec);
    });
    this.proyectos = [];
  }

  quitarTodo() {
    this.proyectosAgregados = [];
    this.filtroProyectosDispo();
  }

  cancelarAgregarProyecto() {
    this.quitarProyectos();
    (<HTMLInputElement>document.getElementById("fechaInicio")).value = null;
    (<HTMLInputElement>document.getElementById("fechaFin")).value = null;
    this.reportes = [];
  }

  cancelAgregarClienteModal() {
    this.closeAddProyectosModal();
    this.proyectosAgregados = [];
  }

  aceptarAgregarClienteModal() {
    if (this.proyectosAgregados.length == 0) {
      return;
    }
    this.closeAddProyectosModal();
  }

  quitarProyectos() {
    this.proyectosAgregados = [];
    this.getProyectos();
  }

  exportExcelReporteCompleto() {
    let element = document.getElementById("table-reportes-completos");

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    let fileName = "reporte_proyecto_recurso_completo.xlsx";

    XLSX.utils.book_append_sheet(wb, ws, "Tiempos Reportados");
    XLSX.writeFile(wb, fileName);
  }

  exportExcelReporteResumido() {
    let element = document.getElementById("table-reportes-resumidos");

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    let fileName = "reporte_proyecto_recurso_resumido.xlsx";

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

    if (this.proyectosAgregados.length == 0) {
      return (this.errorMsj = "Se deben agregar proyectos a la busqueda.");
    }

    //spinner
    document.getElementById("con_spinner").style.display = "block";
    document.getElementById("con_spinner").style.opacity = "100";
    document.getElementById("occ").style.display = "none";

    let proyectos: string = "";
    this.proyectosAgregados.forEach((recurso) => {
      proyectos += recurso.id.toString() + ",";
    });

    this.reporteService
      .getReportesProyectoRecurso(fechaI, fechaF, proyectos)
      .subscribe(
        (data) => {
          document.getElementById("con_spinner").style.display = "none";
          document.getElementById("con_spinner").style.opacity = "0";
          document.getElementById("occ").style.display = "block";

          this.reportes = data;
          console.log("Reportes ProyectoRecursos", data);

          let sumHoras: ReporteProyectoRecurso = new ReporteProyectoRecurso();
          sumHoras.horasReportadas = 0;
          sumHoras.recurso = "TOTAL HORAS";

          this.reportes.forEach(report => {
            sumHoras.horasReportadas += report.horasReportadas;
          })

          this.reportes.push(sumHoras);

          if (this.reportes.length == 0) {
            document.getElementById("con_spinner").style.display = "none";
            document.getElementById("con_spinner").style.opacity = "0";
            document.getElementById("occ").style.display = "block";

            return this.toastr.info(
              "No se encontraron resultados en la busqueda."
            );
          }
        },
        (error) => {
          document.getElementById("con_spinner").style.display = "none";
          document.getElementById("con_spinner").style.opacity = "0";
          document.getElementById("occ").style.display = "block";

          console.log(error);
        }
      );

    this.errorMsj = null;
  }


}
