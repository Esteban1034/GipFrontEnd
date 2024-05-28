import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CargoService } from 'src/app/service/cargo.service';
import { DependenciaEmpleadoService } from 'src/app/service/dependencia-empleado.service';
import { EmpleadoService } from 'src/app/service/empleado.service';
import { EstadoEmpleadoService } from 'src/app/service/estado-empleado.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NovedadService } from 'src/app/service/novedad.service';
import { ToastrService } from 'ngx-toastr';
import { EspecialidadService } from 'src/app/service/especialidad.service';
import { EmpleadoEspecialidadService } from 'src/app/service/empleado-especialidad.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CausasService } from 'src/app/service/causas.service';
import { DependenciaEmpleado } from 'src/app/model/dependencia-empleado';
import { EstadoEmpleado } from 'src/app/model/estado-empleado';
import { Novedad } from 'src/app/Model/novedad';
import { Causas } from 'src/app/Model/causas';
import { Cargo } from 'src/app/model/cargo';
import { EmpleadoEspecialidad } from 'src/app/model/empleado-especialidad';
import { Empleado } from 'src/app/model/empleado';
import { Especialidad } from 'src/app/model/especialidad';
import { Rol } from 'src/app/model/rol';
import { RolService } from 'src/app/service/rol.service';
import { EmpleadoRolService } from 'src/app/service/empleado-rol.service';
import { EmpleadoRol } from 'src/app/model/empleado-rol';
import { UsuarioRoles } from 'src/app/model/usuario-rol';
import { RolSeg } from 'src/app/model/rol-seg';
import { EmpleadoRolSave } from 'src/app/model/empleado-rol-save';
import { GestionUsuariosRoles } from 'src/app/service/gestion-usuario-roles.service';

@Component({
    selector: 'app-update-recurso',
    templateUrl: './update-recurso.component.html',
    styleUrls: ['./update-recurso.component.scss']
})
export class UpdateRecursoComponent implements OnInit {

    id: number = undefined;
    empleado: Empleado = new Empleado();
    roles: Rol[] = [];
    cargos: Cargo[] = [];
    dependencias: DependenciaEmpleado[] = [];
    estados: EstadoEmpleado[] = [];
    rolesSeg:RolSeg[] = [];
    newEspecialidad: EmpleadoEspecialidad = new EmpleadoEspecialidad();
    especialidades: Especialidad[] = [];
    especialidadesEmp: EmpleadoEspecialidad[] = [];
    newNovedad: Novedad = new Novedad();
    novedades: Novedad[] = [];
    causa: Causas[] = [];
    modalNovedad: NgbModalRef;
    modalEspecialidad: NgbModalRef;
    idToDelete: number = undefined;
    newCargo: Cargo = new Cargo();
    newRol: Rol = new Rol();
    addedRoles: EmpleadoRol[] = [];
    errorMsj: string = '';
    rolSeleccionado:RolSeg = new RolSeg();
    usuarioRolSeleccionado:number;
    empleadoRolSave : EmpleadoRolSave = new EmpleadoRolSave();
    rolSeleccionadoId:number;

    recursoForm: FormGroup;
    submitted: boolean = false;
    especialidadForm: FormGroup;
    submittedEF: boolean = false;
    cargoForm: FormGroup;
    submittedC: boolean = false;
    rolForm: FormGroup;
    submittedR: boolean = false;
    novedadForm: FormGroup;
    submittedN: boolean = false;

    constructor(private route: ActivatedRoute,
        private empleadoService: EmpleadoService,
        private rolService: RolService,
        private cargoService: CargoService,
        private dependenciaService: DependenciaEmpleadoService,
        private router: Router,
        private estadoService: EstadoEmpleadoService,
        private modalService: NgbModal,
        private novedadService: NovedadService,
        private causaService: CausasService,
        private toastr: ToastrService,
        private especialidadService: EspecialidadService,
        private especialidadEmpService: EmpleadoEspecialidadService,
        private formBuilder: FormBuilder,
        private empRolService: EmpleadoRolService,
        private gestionUsuariosRoles: GestionUsuariosRoles) {
    }

    session = localStorage.getItem('session');

    ngOnInit(): void {
        this.session = JSON.parse(this.session);
        this.id = this.route.snapshot.params['id'];

        this.empleadoService.getEmpleadoRolById(this.id).subscribe(data => {
            this.empleado = data.empleado;
            this.rolSeleccionadoId= data.idRol;
            this.usuarioRolSeleccionado = data.usuarioRolId;
        }, error => {
            console.log(error);
            this.toastr.error(error.error.message);
            this.router.navigate(['recursos']);
        });

        this.findEspecialidadesByEmpleado();
        this.getRolesByEmpleado();

        this.rolService.findAll().subscribe(data => {
            this.roles = data;
        }, error => console.log(error));

        this.cargoService.getCargosList().subscribe(data => {
            this.cargos = data;
        }, error => console.log(error));

        this.dependenciaService.getDependenciasList().subscribe(data => {
            this.dependencias = data;
        }, error => console.log(error));

        this.estadoService.getEstadosList().subscribe(data => {
            this.estados = data;
        }, error => console.log(error));

        this.causaService.getCausaList().subscribe(data => {
            this.causa = data;
        }, error => console.log(error));

        this.gestionUsuariosRoles.obtenerRoles().subscribe(roles => {
            this.rolesSeg = roles;
            this.rolSeleccionado = this.rolesSeg.find(rol => rol.rolId === this.rolSeleccionadoId);
        }, error => console.log(error));

        this.buildRecursoForm();
        this.buildEspecialidadForm();
        this.buildCargoForm();
        this.buildRolForm();
        this.buildNovedadForm();
    }

    get rf() { return this.recursoForm.controls; }

    buildRecursoForm() {
        this.recursoForm = this.formBuilder.group({
            nombre: ['', [
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(50),
                Validators.pattern('[áéíóúñÁÉÍÓÚÑ,A-Za-z ]{5,50}')
            ]],
            email: ['', [
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(50),
                Validators.email
            ]],
            rolSeguridad: ['', [
                Validators.required
            ]],
            cargo: ['', [
                Validators.required
            ]],
            dependencia: ['', [
                Validators.required
            ]],
            estado: ['', [
                Validators.required
            ]]
        });
    }

    get ef() { return this.especialidadForm.controls; }

    buildEspecialidadForm() {
        this.especialidadForm = this.formBuilder.group({
            especialidad: [null, [
                Validators.required
            ]]
        });
    }

    get cf() { return this.cargoForm.controls; }

    buildCargoForm() {
        this.cargoForm = this.formBuilder.group({
            cargo: ['', [
                Validators.required,
                Validators.pattern('[A-Za-z ]{5,20}')
            ]]
        });
    }

    get rolF() { return this.rolForm.controls; }

    buildRolForm() {
        this.rolForm = this.formBuilder.group({
            rol: ['', [
                Validators.required
            ]]
        });
    }

    get nf() { return this.novedadForm.controls }

    buildNovedadForm() {
        this.novedadForm = this.formBuilder.group({
            causa: ['', [
                Validators.required
            ]],
            fechaInicio: ['', [
                Validators.required
            ]],
            fechaFin: ['', [
                Validators.required
            ]]
        });
    }

    actualizarRecurso() {
        this.submitted = true;

        if (this.validIfHasEspecialidades(this.empleado)) {
            return this.toastr.error('Debe agregar al menos una especialidad.');
        }

        if (this.recursoForm.invalid) {
            return;
        }

        let rolesAsignar: UsuarioRoles = new UsuarioRoles();
        let roles: UsuarioRoles[] = []
        let r = this.rolesSeg.filter(rol => rol.rolId === this.rolSeleccionado.rolId);
        rolesAsignar.rol = r[0];
        roles.push(rolesAsignar)
        rolesAsignar.usuarioRolId=this.usuarioRolSeleccionado;


        this.empleadoRolSave.usuarioRoles = roles;
        this.empleadoRolSave.usuarioRoles[0].rol.submenuRoles = [];
        this.empleadoRolSave.empleado = this.empleado;

        console.log(this.empleadoRolSave);

        this.showSpinner();
        this.empleadoService.updateEmpleado(this.id, this.empleadoRolSave).subscribe(data => {
            this.toastr.info('Recurso actualizado correctamente.');
            this.goToRecursosList();
        }, error => {
            this.hideSpinner();
            console.log(error)
        });
    }

    goToRecursosList() {
        this.router.navigate(['/recursos']);
    }

    findNovedadesByEmpleado() {
        this.novedadService.findByEmpleado(this.id).subscribe(data => {
            this.novedades = data;
        }, error => console.log(error));
    }

    saveNovedad() {
        this.submittedN = true;

        this.newNovedad.fechaInicio = new Date(this.newNovedad.fechaInicio);
        this.newNovedad.fechaInicio.setDate(this.newNovedad.fechaInicio.getDate() + 1);
        this.newNovedad.fechaInicio.setHours(0);
        this.newNovedad.fechaInicio.setMinutes(0);
        this.newNovedad.fechaInicio.setSeconds(0);

        this.newNovedad.fechaFin = new Date(this.newNovedad.fechaFin);
        this.newNovedad.fechaFin.setDate(this.newNovedad.fechaFin.getDate() + 1);
        this.newNovedad.fechaFin.setHours(0);
        this.newNovedad.fechaFin.setMinutes(0);
        this.newNovedad.fechaFin.setSeconds(0);

        this.newNovedad.empleado = this.empleado;

        if (this.novedadForm.invalid) {
            return;
        }
        if (this.newNovedad.fechaInicio != null && this.newNovedad.fechaFin != null) {
            if (!this.validDateNovedad(this.newNovedad.fechaInicio, this.newNovedad.fechaFin)) {
                this.errorMsj = 'La Fecha Inicio no puede ser menor a la fecha actual y la Fecha Fin no puede ser menor a la fecha inicio';
                return;
            }
        }


        this.novedadService.createNovedad(this.newNovedad).subscribe(data => {
            console.log(data);
            this.hideNovedadModal();
            this.toastr.success('Novedad agregada correctamente.');
            this.newNovedad = new Novedad();
            this.submittedN = false;
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
        });
    }

    validDateNovedad(fechaI: Date, fechaF: Date) {
        let fechaA: Date = new Date();
        fechaA.setHours(0);
        fechaA.setMinutes(0);
        fechaA.setSeconds(0);

        if (fechaI.getTime() <= fechaF.getTime() && fechaI.getTime() >= fechaA.getTime()) {
            return true;
        }
        return false;
    }

    showNovedadModal(content) {
        this.modalNovedad = this.modalService.open(content);
        this.findNovedadesByEmpleado();
    }

    hideNovedadModal() {
        this.modalNovedad.close();
    }

    findEspecialidades() {
        this.especialidadService.getEspecialidadesList().subscribe(data => {
            this.especialidades = data;
        }, error => console.log(error));
    }

    findEspecialidadesByEmpleado() {
        this.especialidadEmpService.getEmpleadoEspecialidadByEmpleado(this.id).subscribe(data => {
            this.especialidadesEmp = data;
        }, error => console.log(error));
    }

    addEspecialidad() {
        this.submittedEF = true;
        this.newEspecialidad.empleado = this.empleado;

        if (this.especialidadForm.invalid) {
            return;
        }

        if (this.validIfExistEspecilidad(this.newEspecialidad)) {
            return this.toastr.error("Especialidad a agregar ya existe.");
        }

        this.especialidadEmpService.createEmpleadoEspecialidad(this.newEspecialidad).subscribe(data => {
            console.log(data);
            this.toastr.success("Especialidad agregada correctamente.");
            this.hideEspecialidadModal();
            this.findEspecialidadesByEmpleado();
            this.newEspecialidad = new EmpleadoEspecialidad();
        }, error => console.log(error));
    }

    deleteEspecialidad(id: number) {
        this.especialidadEmpService.deleteEmpleadoEspecialidad(id).subscribe(data => {
            console.log(data);
            this.toastr.warning("Especialidad eliminada correctamente.");
            this.findEspecialidadesByEmpleado();
        }, error => console.log(error));
    }

    validIfExistEspecilidad(especialidad: EmpleadoEspecialidad) {
        this.findEspecialidadesByEmpleado();

        for (let i = 0; i < this.especialidadesEmp.length; i++) {
            console.log(this.especialidadesEmp[i].especialidad.id);
            console.log(especialidad.especialidad.id);
            if (this.especialidadesEmp[i].especialidad.id == especialidad.especialidad.id) {
                return true;
            }
        }

        return false;
    }

    validIfHasEspecialidades(empleado: Empleado) {
        if (this.especialidadesEmp.length == 0 && empleado.cargo.id != 10) {
            return true;
        }
        return false;
    }

    showEspecialidadModal(content) {
        this.modalEspecialidad = this.modalService.open(content);
        this.findEspecialidades();
    }

    hideEspecialidadModal() {
        this.modalEspecialidad.close();
    }

    saveCargo() {
        this.submittedC = true;

        if (this.cargoForm.invalid) {
            return;
        }
        console.log(this.newCargo.id);
        this.cargoService.createCargo(this.newCargo).subscribe(data => {
            this.toastr.success('Cargo guardado correctamente!');
            this.modalService.dismissAll();
            this.newCargo = new Cargo();
            console.log(data);

            this.cargoService.getCargosList().subscribe(data => {
                this.cargos = data;
            }, error => console.log(error));
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
        });
    }

    deleteModal(content, id: number) {
        this.modalService.open(content);
        this.idToDelete = id;
    }

    deleteCargo() {
        this.cargoService.deleteCargo(this.idToDelete).subscribe(data => {
            console.log(data);
            this.idToDelete = undefined;
            this.modalService.dismissAll();
            this.toastr.warning('Cargo eliminado correctamente!');

            this.cargoService.getCargosList().subscribe(data => {
                this.cargos = data;
            }, error => console.log(error));
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
            this.modalService.dismissAll();
        });
    }

    open(content) {
        this.modalService.open(content);
    }

    openRolModal(content) {
        this.modalService.open(content);
    }

    getRolesByEmpleado() {
        this.empRolService.findByEmpleado(this.id).subscribe(data => {
            console.log(data);
            this.addedRoles = data;
        }, error => {
            console.log(error);
            this.toastr.error(error);
        });
    }

    addRol() {
        this.submittedR = true;

        if (this.rolForm.invalid) {
            return;
        }

        let r: EmpleadoRol = new EmpleadoRol();
        r.empleado = this.empleado;
        r.rol = this.newRol;

        this.empRolService.save(r).subscribe(data => {
            this.toastr.success('Rol guardado correctamente');
            this.modalService.dismissAll();
            this.newRol = new Rol();
            this.getRolesByEmpleado();
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
        });
    }

    removeRol(id: number) {
        this.empRolService.delete(id).subscribe(data => {
            console.log(data);
            this.toastr.warning('Rol eliminado correctamente');
            this.getRolesByEmpleado();
        }, error => {
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
