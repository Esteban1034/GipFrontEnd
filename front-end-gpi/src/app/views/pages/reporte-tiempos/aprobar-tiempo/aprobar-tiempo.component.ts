import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReporteTiempo } from 'src/app/model/reporte-tiempo';
import { ReporteTiempoService } from 'src/app/service/reporte-tiempo.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpleadoService } from 'src/app/service/empleado.service';
import { Empleado } from "src/app/model/empleado";
import { EstadoActividadAsigService } from '../../../../service/estado-actividad-asig.service';
import { EmpleadoString } from 'src/app/model/dto/empleado-string';
import { MatTableDataSource } from '@angular/material/table';

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { GestionUsuariosRoles } from 'src/app/service/gestion-usuario-roles.service';
import { RolSeg } from 'src/app/model/rol-seg';


@Component({
    selector: 'app-aprobar-tiempo',
    templateUrl: './aprobar-tiempo.component.html',
    styleUrls: ['./aprobar-tiempo.component.scss']
})
export class AprobarTiempoComponent implements OnInit {

    reportes: ReporteTiempo[] = [];
    fechaInicio: string = '';
    reporteT: ReporteTiempo = new ReporteTiempo();
    fechafin: string = '';
    dataSource = new MatTableDataSource();
    idEmpleado: number;
    idEstado: number;
    estado: any;
    idActividad: number = undefined;
    id: number = undefined;
    nombreToSearch: string = '';

    form: FormGroup;
    submitted: boolean = false;

    errorMsj: string = "";
    recursosAgregados: Empleado[] = [];
    addRecursosModal: NgbModalRef;
    recursoFiltro: any[];
    recursos: Empleado[] = [];
    searchTextR: string = "";
    recursosAdd: number[] = [];
    sessionRol: RolSeg = new RolSeg();

    constructor(private reporteService: ReporteTiempoService,
        private empleadoService: EmpleadoService,
        private formBuilder: FormBuilder,
        private modalService: NgbModal,
        private router: Router,
        private toast: ToastrService,
        private toastr: ToastrService,
        private gestionUsuariosRolesService: GestionUsuariosRoles) { }

    session = localStorage.getItem('session');
    sessionObject: EmpleadoString = new EmpleadoString();

    ngOnInit(): void {
        this.sessionObject = JSON.parse(this.session);
        this.session = JSON.parse(this.session);

        this.getReportes();
        this.buildForm();
        this.getRecursos();
    }

    goToAprobarTiempoList() {
        this.router.navigate(['reporte-tiempo/aprobar-tiempo-list']);
    }

    aprobar() {

        document.getElementById('con_spinner').style.display = 'block';
        document.getElementById('con_spinner').style.opacity = '100';
        document.getElementById('occ').style.display = 'none';

        var hoy = Date.now();
        var f = new Date(hoy);

        this.reporteService.aprobar(this.id, f, this.session["id"]).subscribe(data => {
            this.toastr.success('Reporte aprobado correctamente');
            this.goToAprobarTiempoList();
        }, error => {
            console.log(error);
        });

    }

    searchRecursoByName() {
      this.recursosAdd = this.recursosAgregados.filter(empleado => empleado.id).map(empleado => empleado.id);
      this.reporteService.getReportesFiltradosPorEmpleados(this.recursosAdd).subscribe( data =>{
        data.sort((a, b) => (a.fecha > b.fecha ? -1 : 1));
        this.reportes = data;
      })
    }
  

    aprobacionMasiva() {
        let list: ReporteTiempo[] = [];
        let flag: boolean = false;

        this.reportes.forEach(reporte => {
            if (reporte.checked) {
                flag = true;
            }
        });

        if (!flag) {
            return this.toast.error('No ha seleccionado ningún recurso');
        }

        this.reportes.forEach(recurso => {
            if (recurso.checked) {
                list.push(recurso);
            }
        });

        list.forEach(recursoAct => {
            recursoAct.asignador = this.session['nombre'];
        });

        var hoy = Date.now();
        var f = new Date(hoy);

        list.forEach(element => {
            this.reporteService.aprobar(element.id, f, this.session["id"]).subscribe(data => {
                this.toastr.success('Reporte aprobado correctamente');
            }, error => {
                console.log(error);
            });
        });

        const updatedData: ReporteTiempo[] = [];
        this.reportes.forEach(rep => {
            let isApproved: boolean = false;
            list.forEach(approved => {
                if (rep.id === approved.id) isApproved = true;
            });
            if (!isApproved) updatedData.push(rep);
        });
        this.reportes = updatedData;
    }

    deleteFiltro() {
        var e: ReporteTiempo[] = [];
        this.reportes = e;
        this.getReportes();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            fechaInicio: ['', [Validators.required]],
            fechaFin: ['', [Validators.required]]
        });
    }

    get f() {
        return this.form.controls;
    }

    getReportes() {
      this.gestionUsuariosRolesService.getByRol(parseInt(this.session['id'])).subscribe(data => {
        this.sessionRol = data;
        if (this.sessionRol.rolNombre === "USUARIO ADMINISTRADOR" || this.sessionRol.rolNombre === "GERENTE DE PROYECTOS" || this.sessionRol.rolNombre === "DIRECTOR DE PROYECTOS") {

            this.reporteService.findByProyectoInt().subscribe(data => {
                data.sort((a, b) => (a.fecha > b.fecha ? -1 : 1));
                data.forEach((reporte) => {
                    if (reporte.asignador == this.sessionObject.nombre ||
                        reporte.aprobador == this.sessionObject.id) {
                        this.reportes.push(reporte);
                    }
                    if (!reporte.asignador && !reporte.aprobador) {
                        this.reportes.push(reporte);
                    }
                });
            }, error => {
                console.log(error);
            });

            // /* this.reporteService.getReportesTiempoList().subscribe(data => { */
            this.reporteService.getReportesTiempoPendienteAprobacion().subscribe(data => {
                data.forEach((reporte) => {
                    if (reporte.asignador == this.sessionObject.nombre ||
                        reporte.aprobador == this.sessionObject.id) {
                        this.reportes.push(reporte);
                    }
                    if (!reporte.asignador && !reporte.aprobador) {
                        this.reportes.push(reporte);
                    }
                });
                this.reportes.sort((a, b) => (a.fecha > b.fecha ? -1 : 1));
            }, error => {
                console.log(error);
            });

        }

        if (this.sessionRol.rolNombre === "LÍDER PROYECTOS") {
            this.reporteService.findByLider(this.sessionObject.id).subscribe(data => {
                data.sort((a, b) => (a.fecha > b.fecha ? -1 : 1));
                this.reportes = data;
            }, error => {
                console.log(error);
            });
        }
      });
    }

    detalleReporte(id: number) {
        this.reporteService.getReporteTiempoById(id).subscribe(data => {
            if (data.estado.id == 3) {
                return this.toastr.error('Reporte no se puede de devolver, debe esperar a que sea reenviado por el recurso.');
            }

            this.router.navigate(['reporte-tiempo/aprobar-tiempo/', id]);
        }, error => console.log(error));

    }

    search() {
        this.errorMsj = null;
        this.reportes = [];
        this.submitted = true;
      
        if (this.form.invalid) {
          return;
        }
      
        if (this.recursosAgregados.length == 0) {
          return (this.errorMsj = "Se deben agregar recursos a la búsqueda.");
        }
      
        let empleados: string = "";
        this.recursosAgregados.forEach((recurso) => {
          empleados += recurso.id.toString() + ",";
        });
      
        this.reporteService
          .findByEmpleados(empleados)
          .subscribe(
            (data) => {
              this.reportes = data;
      
              if (this.reportes.length == 0) {
                return this.toastr.info(
                  "No se encontraron resultados en la búsqueda de nombres de recursos."
                );
              }
            },
            (error) => {
              console.log(error);
            }
          );
      
        this.errorMsj = null;
      }
      

      openAddRecursosModal(content) {
        this.addRecursosModal = this.modalService.open(content, {
          size: "lg",
          scrollable: true,
        });
      }

      quitarRecurso(empleado: Empleado) {
        this.recursosAgregados.forEach((emp, index) => {
          if (emp.id == empleado.id) {
            this.recursosAgregados.splice(index, 1);
            this.recursoFiltro.push(emp);
          }
        });
      }

      cancelarAgregarRecurso() {
        this.quitarRecursos();
        (<HTMLInputElement>document.getElementById("fechaInicio")).value = null;
        (<HTMLInputElement>document.getElementById("fechaFin")).value = null;
        this.reportes = [];
      }

      quitarRecursos() {
        this.recursosAgregados = [];
        this.searchRecursoByName();
        this.getRecursos();
      }

      getRecursos() {
        this.empleadoService.getEmpleadosList().subscribe((data) => {
          data.sort((a, b) => (a.nombre < b.nombre ? -1 : 1));
          this.recursos = data;
          this.recursoFiltro = data;
        });
      }

      cancelAgregarRecursoModal() {
        this.closeAddRecursosModal();
        this.recursosAgregados = [];
        this.getRecursos();
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

      seleccionarTodo() {
        this.recursoFiltro.forEach((recurs) => {
          this.recursosAgregados.push(recurs);
        });
        this.recursoFiltro = [];
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

      quitarTodo() {
        this.recursosAgregados = [];
        this.filtroRecursosDispo();
      }

      aceptarAgregarRecursoModal() {
        if (this.recursosAgregados.length == 0) {
          return;
        }
        this.closeAddRecursosModal();
      }

      closeAddRecursosModal() {
        this.addRecursosModal.close();
      }

}