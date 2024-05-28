import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DependenciaEmpleado } from 'src/app/model/dependencia-empleado';
import { EstadoEmpleado } from 'src/app/model/estado-empleado';
import { DependenciaEmpleadoService } from 'src/app/service/dependencia-empleado.service';
import { EstadoEmpleadoService } from '../../../../service/estado-empleado.service';
import { CargoService } from '../../../../service/cargo.service';
import { EmpleadoService } from '../../../../service/empleado.service';
import { EspecialidadService } from '../../../../service/especialidad.service';
import { EmpleadoEspecialidadService } from 'src/app/service/empleado-especialidad.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Cargo } from 'src/app/model/cargo';
import { EmpleadoEspecialidad } from 'src/app/model/empleado-especialidad';
import { Empleado } from 'src/app/model/empleado';
import { Especialidad } from 'src/app/model/especialidad';
import { Rol } from 'src/app/model/rol';
import { RolService } from 'src/app/service/rol.service';
import { EmpleadoRol } from 'src/app/model/empleado-rol';
import { EmpleadoRolService } from 'src/app/service/empleado-rol.service';
import { GestionUsuariosRoles } from 'src/app/service/gestion-usuario-roles.service';
import { RolSeg } from 'src/app/model/rol-seg';
import { UsuarioRoles } from 'src/app/model/usuario-rol';
import { EmpleadoRolSave } from 'src/app/model/empleado-rol-save';

@Component({
    selector: 'app-form-recursos',
    templateUrl: './form-recursos.component.html',
    styleUrls: ['./form-recursos.component.scss'],
    providers: [NgbModalConfig, NgbModal]
})
export class FormRecursosComponent implements OnInit {

    dc: boolean;

    errorMsj = '';
    empleado: Empleado = new Empleado();
    roles: Rol[] = [];
    cargos: Cargo[] = [];
    dependencias: DependenciaEmpleado[];
    estados: EstadoEmpleado[];
    newEspecialidad: Especialidad = new Especialidad();
    especialidades: Especialidad[] = [];
    selectedEspecialidades: Especialidad[] = [];
    selectedRoles: Rol[] = [];
    idToDelete: number = undefined;
    newCargo: Cargo = new Cargo();
    newRol: Rol = new Rol();
    addedRoles: EmpleadoRol[] = [];
    isChecked: boolean = false;

    recursoForm: FormGroup;
    submitted: boolean = false;
    especialidadForm: FormGroup;
    submittedEF: boolean = false;
    cargoForm: FormGroup;
    submittedC: boolean = false;
    rolForm: FormGroup;
    submittedR: boolean = false;
    rolesSeg: RolSeg[] = [];
    rolSeleccionado: RolSeg = new RolSeg();
    empleadoRolSave: EmpleadoRolSave = new EmpleadoRolSave();

    constructor(private empleadoService: EmpleadoService,
        private rolService: RolService,
        private cargoService: CargoService,
        private dependenciaService: DependenciaEmpleadoService,
        private estadoService: EstadoEmpleadoService,
        private especialidadService: EspecialidadService,
        private emplEspecialidadService: EmpleadoEspecialidadService,
        private router: Router,
        private toastr: ToastrService,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private empRolService: EmpleadoRolService,
        private gestionUsuariosRoles: GestionUsuariosRoles) {

    }

    session = localStorage.getItem('session');

    ngOnInit(): void {
        this.session = JSON.parse(this.session);



        this.cargoService.getCargosList().subscribe(data => {
            this.cargos = data;
        }, error => console.log(error));

        this.especialidadService.getEspecialidadesList().subscribe(data => {
            this.especialidades = data;
        }, error => console.log(error));

        this.dependenciaService.getDependenciasList().subscribe(data => {
            this.dependencias = data;
        }, error => console.log(error));

        this.estadoService.getEstadosList().subscribe(data => {
            this.estados = data;
        }, error => console.log(error));

        this.rolService.findAll().subscribe(data => {
            this.roles = data;
        }, error => console.log(error));

        this.gestionUsuariosRoles.obtenerRoles().subscribe(roles => {
            this.rolesSeg = roles;
        }, error => console.log(error));

        this.empleado.cargo = new Cargo();

        this.buildRecursoForm();
        this.buildEspecialidadForm();
        this.buildCargoForm();
        this.buildRolForm();

    }



    extraerRoles() {

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

            cargo: ['', [
                Validators.required
            ]],

            rolSeguridad: ['', [
                Validators.required
            ]],
            dependencia: ['', [
                Validators.required
            ]],
        });
    }

    get ef() { return this.especialidadForm.controls; }

    buildEspecialidadForm() {
        this.especialidadForm = this.formBuilder.group({
            especialidad: ['', [
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
                Validators.required,
            ]]
        });
    }

    validarCheked() {
        this.isChecked = !this.isChecked;
    }

    saveRecurso() {
        let _empleado;

        let rolesAsignar: UsuarioRoles = new UsuarioRoles();
        let roles: UsuarioRoles[] = []
        let r = this.rolesSeg.filter(rol => rol.rolId === this.rolSeleccionado.rolId);
        rolesAsignar.rol = r[0];
        roles.push(rolesAsignar)

        this.empleadoRolSave.usuarioRoles = roles;
        this.empleadoRolSave.usuarioRoles[0].rol.submenuRoles = [];
        this.empleadoRolSave.empleado = this.empleado;


        this.empleadoService.createEmpleado(this.empleadoRolSave).subscribe(data => {
            this.toastr.success('Recurso guardado correctamente!');
            this.selectedEspecialidades.forEach(e => {
                let empleadoEspecialidad = new EmpleadoEspecialidad();
                _empleado = data;
                empleadoEspecialidad.empleado = _empleado;
                empleadoEspecialidad.especialidad = e;

                this.emplEspecialidadService.createEmpleadoEspecialidad(empleadoEspecialidad).subscribe(data1 => {
                }, error => {
                    this.hideSpinner();

                    console.log(error)
                });
            });

            /*this.selectedRoles.forEach(r => {
                let empleadoRol = new EmpleadoRol();
                _empleado = data;
                empleadoRol.empleado = _empleado;
                empleadoRol.rol = r;

                this.empRolService.save(empleadoRol).subscribe(data1 => {
                    console.log(data1);
                }, error => {

                    this.hideSpinner();

                    console.log(error);
                });
            });

            this.addedRoles.forEach(r => {
                r.empleado = _empleado;

                this.empRolService.save(r).subscribe(data => {
                    console.log(data);
                }, error => {
                    this.hideSpinner();

                    console.log(error);
                });
            })*/

            this.goToRecursoList();
        }, error => {
            this.hideSpinner();
            console.log(error)
            this.toastr.error(error.error.message);
            this.errorMsj = error.error.message;
        });
    }

    goToRecursoList() {
        this.router.navigate(['/recursos']);
    }

    addEspecialidad() {
        this.submittedEF = true;

        if (this.especialidadForm.invalid) {
            return;
        }

        for (let i = 0; i < this.selectedEspecialidades.length; i++) {
            if (this.selectedEspecialidades[i].especialidad === this.newEspecialidad.especialidad) {
                this.modalService.dismissAll();
                this.newEspecialidad = new Especialidad();
                return this.toastr.error('La especialidad a agregar ya existe');
            }
        }

        this.selectedEspecialidades.push(this.newEspecialidad);
        this.toastr.success('La especialidad se a agregado correctamente');
        this.modalService.dismissAll();
        this.newEspecialidad = new Especialidad();
    }

    removeEspecialidad(id: number) {
        let _id = 0;
        this.selectedEspecialidades.forEach((value, index) => {
            value.id = _id++;
            if (value.id == id) {
                this.selectedEspecialidades.splice(index, 1);
                return this.toastr.warning('Especialidad eliminada correctamente');
            }
        });
    }

    saveCargo() {
        this.submittedC = true;

        if (this.cargoForm.invalid) {
            return;
        }
        this.cargoService.createCargo(this.newCargo).subscribe(data => {
            this.toastr.success('Cargo guardado correctamente!');
            this.modalService.dismissAll();
            this.newCargo = new Cargo();

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
            this.idToDelete = undefined;
            this.modalService.dismissAll();
            this.toastr.warning('Cargo eliminado correctamente!');

            this.cargoService.getCargosList().subscribe(data => {
                this.cargos = data;
            }, error => console.log(error));
        }, error => {
            console.log(error);
            this.toastr.error(error);
            this.modalService.dismissAll();
        });
    }

    onSubmit() {

        this.submitted = true;

        if (this.recursoForm.invalid) {
            return;
        }

        if (this.selectedEspecialidades.length == 0 && this.empleado.cargo.id != 10) {
            return this.toastr.error('Debe agregar al menos una especialidad al empleado');
        }
        /*
                if (this.selectedRoles.length == 0 && this.empleado.cargo.id != 10) {
                    return this.toastr.error('Debe agregar al menos un rol al empleado');
                }
        */
        this.showSpinner();

        this.saveRecurso();
    }

    open(content) {
        this.modalService.open(content);
    }

    removeRol(id: number) {
        let _id = 0;
        this.selectedRoles.forEach((value, index) => {
            value.id = _id++;
            if (value.id == id) {
                this.selectedRoles.splice(index, 1);
                this.toastr.warning('Rol eliminado correctamente');
            }
        });
    }

    addRol() {
        this.submittedEF = true;

        if (this.rolForm.invalid) {
            return;
        }

        for (let i = 0; i < this.selectedRoles.length; i++) {
            if (this.roles[i].rol === this.newRol.rol) {
                this.modalService.dismissAll();
                this.newRol = new Rol();
                return this.toastr.error('El rol a agregar ya existe');
            }
        }

        if (this.selectedRoles.length >= 1) {
            return this.toastr.error('Solo se puede agregar un rol');
        }

        this.selectedRoles.push(this.newRol);
        this.toastr.success('Rol agregado correctamente');
        this.modalService.dismissAll();
        this.newRol = new Rol();
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
