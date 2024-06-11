import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ContenidoUfs } from 'src/app/model/contenido-ufs';
import { Esfuerzo } from 'src/app/model/esfuerzo';
import { Funcion } from 'src/app/model/funcion';
import { MantenimientoUnidad } from 'src/app/model/mantenimiento-unidad';
import { ContenidoUfsService } from 'src/app/service/contenidoufs.service';
import { MantenimientoUnidadService } from 'src/app/service/mantenimiento-unidad-service';

@Component({
  selector: 'app-unidad-funcional',
  templateUrl: './unidad-funcional.component.html',
  styleUrls: ['./unidad-funcional.component.scss']
})
export class formularioUnidadFuncional implements OnInit {
  formCreaContenidoUfs: FormGroup;
  esfuerzos: Esfuerzo[] = [];
  funciones: Funcion[] = [];
  mantenimientos: MantenimientoUnidad[] = [];
  contenidoUfsList: ContenidoUfs[] = [];
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private contenidoUfsService: ContenidoUfsService,
    private mantenimientoUnidadService: MantenimientoUnidadService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getEsfuerzoData();
    this.getFuncionData();
    this.getMantenimiento();
    this.getContenidoUfs();
  }

  get fc() { return this.formCreaContenidoUfs.controls; }

  buildForm() {
    this.formCreaContenidoUfs = this.formBuilder.group({
      nombreCaso: ['', Validators.required],
      porcentajeConstruccion: ['', Validators.required],
      porcentajeDiseno: ['', Validators.required],
      porcentajePruebas: ['', Validators.required],
      esfuerzo: [null], // Permitir que esfuerzo sea nulo
      funcion: [null], // Permitir que funcion sea nulo
      mantenimientoUnidad: ['', Validators.required]
    });
  }

  getContenidoUfs() {
    this.contenidoUfsService.getContenidoUfs().subscribe(
      data => {
        this.contenidoUfsList = data;
      },
      error => {
        console.log(error);
        this.toastr.error('Error al obtener los datos de contenido de unidades funcionales');
      }
    );
  }

  getEsfuerzoData() {
    this.contenidoUfsService.getEsfuerzoData().subscribe(
      data => {
        this.esfuerzos = data;
      },
      error => {
        console.log(error);
        this.toastr.error('Error al obtener los datos de esfuerzo');
      }
    );
  }

  getFuncionData() {
    this.contenidoUfsService.getFuncionData().subscribe(
      data => {
        this.funciones = data;
      },
      error => {
        console.log(error);
        this.toastr.error('Error al obtener los datos de función');
      }
    );
  }

  getMantenimiento() {
    this.mantenimientoUnidadService.getMantenimientos().subscribe(
      data => {
        this.mantenimientos = data;
      },
      error => {
        console.log(error);
        this.toastr.error('Error al obtener los datos de mantenimiento');
      }
    );
  }


  saveContenidoUfs() {
    if (this.formCreaContenidoUfs.invalid) {
      this.toastr.error('Por favor, complete el formulario correctamente');
      return;
    }

    const contenido: ContenidoUfs = this.formCreaContenidoUfs.value;
    this.contenidoUfsService.saveContenidoUfs(contenido).subscribe(
      data => {
        this.toastr.success('Contenido de unidad funcional creado exitosamente');
        this.formCreaContenidoUfs.reset();
        this.submitted = false;
        this.getContenidoUfs();
      },
      error => {
        console.log(error);
        this.toastr.error('Error al crear el contenido de unidad funcional');
      }
    );
  }


  onSubmit() {
    this.submitted = true;

    if (this.formCreaContenidoUfs.valid) {
      const contenidoUfs: ContenidoUfs = this.formCreaContenidoUfs.value;
      this.contenidoUfsService.saveContenidoUfs(contenidoUfs).subscribe(
        response => {
          this.toastr.success('Contenido de unidad funcional creado exitosamente');
          this.formCreaContenidoUfs.reset();
          this.submitted = false;
          this.getContenidoUfs();
        },
        error => {
          console.log(error);
          this.toastr.error('Error al crear el contenido de unidad funcional');
        }
      );
    } else {
      this.toastr.error('Por favor, complete el formulario correctamente');
    }
  }
}