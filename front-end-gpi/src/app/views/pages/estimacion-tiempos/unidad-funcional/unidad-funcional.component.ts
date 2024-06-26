

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ContenidoUfs } from 'src/app/model/contenido-ufs';
import { Esfuerzo } from 'src/app/model/esfuerzo';
import { EstimacionTiempos } from 'src/app/model/estimacion-ufs';
import { Funcion } from 'src/app/model/funcion';
import { MantenimientoPesoHora } from 'src/app/model/mantenimiento-peso-hora';
import { MantenimientoUnidad } from 'src/app/model/mantenimiento-unidad';
import { Ufs } from 'src/app/model/ufs';
import { ContenidoUfsService } from 'src/app/service/contenidoufs.service';
import { EsfuerzoService } from 'src/app/service/esfuerzo.service';
import { FuncionService } from 'src/app/service/funcion.Service';
import { MantenimientoUnidadService } from 'src/app/service/mantenimiento-unidad-service';

@Component({
  selector: 'app-unidad-funcional',
  templateUrl: './unidad-funcional.component.html',
  styleUrls: ['./unidad-funcional.component.scss']
})
export class formularioUnidadFuncional implements OnInit {
  formCreaContenidoUfs: FormGroup;
  formCrearNuevoUfs: FormGroup;
  formCreaFuncion: FormGroup;
  ufs: Ufs[] = [];
  estimaciones: EstimacionTiempos[] = [];
  contenidoUfsSeleccionado: ContenidoUfs | null = null;
  mostrarFormularioEdicion: boolean = false;
  esfuerzos: Esfuerzo[] = [];
  funciones: Funcion[] = [];
  mantenimientos: MantenimientoUnidad[] = [];
  contenidoUfsList: ContenidoUfs[] = [];
  submitted: boolean = false;
  horasDiseno: number = 0;
  horasConstruccion: number = 0;
  horasPruebas: number = 0;
  totalAjusteDiseno: number = 0;
  totalAjusteConstruccion: number = 0;
  totalAjustePruebas: number = 0;
  showCreateFunctionForm: boolean = false;
  showNuevoUfsForm: boolean | null = null;
  ultimoIdIncrementado: number | null = null;
  nuevoIdUfs: number = 1; // Declaración inicial
  ultimoContenidoUfs: ContenidoUfs | null = null;
  isEditing = false;
  isNewUfs = false;
  nuevoUfsId = 0;
  lastGeneratedUfsId: number = 1;
  totalPropuesta: number = 0;
  totalDiseno: number = 0;
  totalPrueba: number = 0;
  ultimoIdUfsCreado: number = 4; // Iniciar en 3 o el valor que corresponda según tu lógica

  constructor(
    private formBuilder: FormBuilder,
    private mantenimientoUnidadService: MantenimientoUnidadService,
    private contenidoUfsService: ContenidoUfsService,
    private esfuerzoService: EsfuerzoService,
    private funcionService: FuncionService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.buildForms();
    this.getFuncionData();
    this.buildFuncionForm();
    this.getMantenimiento();
    this.getContenidoUfs();
    this.getEsfuerzos();
    this.cargarUltimoContenidoUfs();

  }




 buildForms() {
    this.formCrearNuevoUfs  = this.formBuilder.group({
      nombreCaso: ['', Validators.required],
      porcentajeConstruccion: ['', Validators.required],
      porcentajeDiseno: ['', Validators.required],
      porcentajePruebas: ['', Validators.required],
      funcionSeleccionada: [''],
      funcion: [''],
      mantenimientoUnidad: ['', Validators.required],
       });
  }


  mostrarFormularioNuevoUfs() {
    this.actualizarNuevoIdUfs(); // Actualizar el nuevo ID de UFS al mostrar el formulario


  }

  
  cargarUltimoContenidoUfs() {
    this.contenidoUfsService.getUltimoContenidoUfs().subscribe(
      (ultimoContenido: ContenidoUfs) => {
        this.ultimoContenidoUfs = ultimoContenido;
        this.actualizarNuevoIdUfs();
      },
      error => {
        console.error('Error al obtener el último contenido de UFS:', error);
      }
    );
  }
  crearSiguienteIdUfs() {
    // Incrementar el último ID creado para obtener el siguiente
    this.ultimoIdUfsCreado++;
    this.nuevoIdUfs = this.ultimoIdUfsCreado;
    console.log('Siguiente ID de UFS:', this.nuevoIdUfs);
  }
  
  crearNuevoUFS() {
    if (this.formCrearNuevoUfs.valid && this.ultimoContenidoUfs) {
      const nuevoContenidoUfs: ContenidoUfs = {
        id: 0,
        nombreCaso: this.formCrearNuevoUfs.get('nombreCaso')?.value || null,
        porcentajeConstruccion: this.formCrearNuevoUfs.get('porcentajeConstruccion')?.value || null,
        porcentajeDiseno: this.formCrearNuevoUfs.get('porcentajeDiseno')?.value || null,
        porcentajePruebas: this.formCrearNuevoUfs.get('porcentajePruebas')?.value || null,
        totalDiseno: null,
        totalConstruccion: null,
        totalPruebas: null,
        esfuerzo: null,
        funcion: this.formCrearNuevoUfs.get('funcionSeleccionada')?.value || null,
        mantenimientoUnidad: this.formCrearNuevoUfs.get('mantenimientoUnidad')?.value || null,
        ufs: {
          id: this.nuevoIdUfs,
          nombre: `UFS ${this.nuevoIdUfs}`,
        },
        estimacionUfs: this.ultimoContenidoUfs.estimacionUfs // Asigna la estimación UFS del último contenido
      };

      this.contenidoUfsService.saveContenidoUfs(nuevoContenidoUfs).subscribe(
        (response: any) => {
          console.log(response);
          this.toastr.success('Contenido de UFS creado exitosamente.');
          this.getContenidoUfs();
          this.resetForm();
          this.actualizarUltimoIdUfsCreado(); // Actualizar el último ID creado
        },
        (error: any) => {
          console.error('Error al guardar el contenido de UFS:', error);
          this.toastr.error('Error al guardar el contenido de UFS. Por favor, intenta nuevamente.');
        }
      );
    } else {
      this.toastr.error('Por favor completa todos los campos requeridos antes de guardar.');
    }
  }

  actualizarNuevoIdUfs() {
    if (this.ultimoContenidoUfs && this.ultimoContenidoUfs.ufs) {
      this.nuevoIdUfs = this.ultimoContenidoUfs.ufs.id + 1;
    } else {
      this.nuevoIdUfs = 1; // Inicia en 1 si no hay último contenido de UFS
    }
    this.ultimoIdUfsCreado = this.nuevoIdUfs - 1; // Actualizar el último ID creado
  }

  actualizarUltimoIdUfsCreado() {
    this.ultimoIdUfsCreado = this.nuevoIdUfs;
  }

  
  
  buildFuncionForm() {
    this.formCreaFuncion = this.formBuilder.group({
      funcion: ['', Validators.required],
    });
  }

  buildForm() {
    this.formCreaContenidoUfs = this.formBuilder.group({
      nombreCaso: ['', Validators.required],
      porcentajeConstruccion: ['', Validators.required],
      porcentajeDiseno: ['', Validators.required],
      porcentajePruebas: ['', Validators.required],
      funcionSeleccionada: [''],
      funcion: [''],
      mantenimientoUnidad: ['', Validators.required],
       });
  }

  get fc() { return this.formCreaContenidoUfs.controls; }

  getContenidoUfs() {
    this.contenidoUfsService.getContenidoUfs().subscribe(
      (data: ContenidoUfs[]) => {
        this.contenidoUfsList = data;
      },
      error => {
        console.error(error);
        this.toastr.error('Error al obtener los datos de contenido de unidades funcionales');
      }
    );
  }

  editarUltimoContenido() {
    if (this.ultimoContenidoUfs) {
      console.log('Editando el último contenido de UFS:', this.ultimoContenidoUfs);

      // Utilizar patchValue para asignar los valores al formulario
      this.formCreaContenidoUfs.patchValue({
        nombreCaso: this.ultimoContenidoUfs.nombreCaso,
        porcentajeConstruccion: this.ultimoContenidoUfs.porcentajeConstruccion,
        porcentajeDiseno: this.ultimoContenidoUfs.porcentajeDiseno,
        porcentajePruebas: this.ultimoContenidoUfs.porcentajePruebas,
        funcionSeleccionada: this.ultimoContenidoUfs.funcion,
        mantenimientoUnidad: this.ultimoContenidoUfs.mantenimientoUnidad,
      });

      // Establecer el modo de edición a true
      this.isEditing = true;
    } else {
      console.warn('No hay último contenido de UFS cargado para editar.');
      // Si no hay último contenido cargado, procede como si fuera un nuevo formulario
      this.resetForm(); // Restablecer el formulario antes de crear uno nuevo
      this.isEditing = false; // Asegurar que el modo de edición esté desactivado
    }
  }

  obtenerHoras(peso: number) {
    this.contenidoUfsService.obtenerHoras(peso).subscribe(
      (resultado: any) => {
        console.log('Resultado de obtenerHoras:', resultado);
        this.horasConstruccion = this.redondearHoras(resultado.hora);
        this.horasDiseno = this.redondearHoras(resultado.hora);
        this.horasPruebas = this.redondearHoras(resultado.hora);
        this.ajustarHorasPorEsfuerzo();
        this.actualizarValoresFormulario(); // Actualizar el formulario después de obtener las horas
        this.calcularTotales();
      },
      (error) => {
        console.error('Error al obtener horas:', error);
        this.toastr.error('Error al obtener las horas del mantenimiento');
      }
    );
  }

  getEsfuerzos() {
    this.esfuerzoService.gEsfuerzos().subscribe(
      (data: Esfuerzo[]) => {
        this.esfuerzos = data;
      },
      error => {
        console.error(error);
        this.toastr.error('Error al obtener los datos de esfuerzo');
      }
    );
  }

  ajustarHorasPorEsfuerzo() {
    const esfuerzoDiseño = this.esfuerzos.find(e => e.nombre === 'Diseño');
    const esfuerzoConstruccion = this.esfuerzos.find(e => e.nombre === 'Construcción');
    const esfuerzoPruebas = this.esfuerzos.find(e => e.nombre === 'Pruebas');
    
    if (esfuerzoConstruccion) {
      this.horasConstruccion = this.redondearHoras(this.horasConstruccion * (esfuerzoConstruccion.porcentaje)/(esfuerzoDiseño.porcentaje));
    }
    
    if (esfuerzoPruebas) {
      this.horasPruebas = this.redondearHoras(this.horasPruebas * (esfuerzoPruebas.porcentaje)/(esfuerzoDiseño.porcentaje));
    }
  }
  
  redondearHoras(valor: number): number {
    return Math.ceil(valor * 10) / 10;
  }

  actualizarValoresFormulario() {
    if (this.formCreaContenidoUfs) { // Verificar si el formulario está inicializado
      this.fc.horaDiseno?.setValue(this.horasDiseno); // Usar el operador ? para acceder a setValue de manera segura
      this.fc.horaConstruccion?.setValue(this.horasConstruccion);
      this.fc.horaPruebas?.setValue(this.horasPruebas);
    } else {
      console.error('El formulario formCreaContenidoUfs no está inicializado.');
    }
  }

  calcularTotales() {
    const porcentajeConstruccion = parseFloat(this.fc.porcentajeConstruccion.value) || 0;
    const porcentajeDiseno = parseFloat(this.fc.porcentajeDiseno.value) || 0;
    const porcentajePruebas = parseFloat(this.fc.porcentajePruebas.value) || 0;

    this.totalAjusteConstruccion = this.horasConstruccion * (porcentajeConstruccion/100) + this.horasConstruccion;
    this.totalAjusteDiseno = this.horasDiseno * (porcentajeDiseno/100) + this.horasDiseno;
    this.totalAjustePruebas = this.horasPruebas * (porcentajePruebas/100) + this.horasPruebas;
  }

  getFuncionData() {
    this.funcionService.getFuncions().subscribe(
      (data: Funcion[]) => {
        this.funciones = data;
      },
      error => {
        console.error(error);
        this.toastr.error('Error al obtener los datos de función');
      }
    );
  }

  

  cancelCreateFunction() {
    this.showCreateFunctionForm = false;
  }

  getMantenimiento() {
    this.mantenimientoUnidadService.getMantenimientos().subscribe(
      (data: MantenimientoUnidad[]) => {
        this.mantenimientos = data;
      },
      error => {
        console.error(error);
        this.toastr.error('Error al obtener los datos de mantenimiento de unidad');
      }
    );
  }

  onMantenimientoChange(event: any) {
    const mantenimientoId = event.target.value;
    const selectedMantenimiento = this.mantenimientos.find(m => m.id === parseInt(mantenimientoId));
  
    if (selectedMantenimiento) {
      this.contenidoUfsService.obtenerHoras(selectedMantenimiento.peso).subscribe(
        (resultado: any) => {
          console.log('Resultado de obtenerHoras:', resultado);
          this.horasConstruccion = this.redondearHoras(resultado.hora);
          this.horasDiseno = this.redondearHoras(resultado.hora);
          this.horasPruebas = this.redondearHoras(resultado.hora);
          this.ajustarHorasPorEsfuerzo();
          this.actualizarValoresFormulario(); // Asegura que los valores en el formulario se actualicen
          this.calcularTotales();
        },
        (error) => {
          console.error('Error al obtener horas:', error);
          this.toastr.error('Error al obtener las horas del mantenimiento');
        }
      );
    } else {
      console.error('No se encontró el mantenimiento seleccionado');
      this.resetFormFields(); // Restablece los campos del formulario si no se encuentra el mantenimiento seleccionado
    }
  }
  saveContenidoUfs() {
    this.submitted = true;

    if (this.formCreaContenidoUfs.valid) {
      if (this.ultimoContenidoUfs && (this.ultimoContenidoUfs.ufs && this.ultimoContenidoUfs.ufs.id) ||
          (this.isNewUfs && this.nuevoUfsId)) {

        const contenidoUfsData: ContenidoUfs = {
          id: this.isEditing ? this.ultimoContenidoUfs.id : 0,
          nombreCaso: this.fc.nombreCaso ? this.fc.nombreCaso.value || null : null,
          porcentajeConstruccion: this.fc.porcentajeConstruccion ? this.fc.porcentajeConstruccion.value || null : null,
          porcentajeDiseno: this.fc.porcentajeDiseno ? this.fc.porcentajeDiseno.value || null : null,
          porcentajePruebas: this.fc.porcentajePruebas ? this.fc.porcentajePruebas.value || null : null,
          totalDiseno: null,
          totalConstruccion: null,
          totalPruebas: null,
          esfuerzo: null,
          funcion: this.fc.funcionSeleccionada ? this.fc.funcionSeleccionada.value || null : (this.fc.funcion ? this.fc.funcion.value || null : null),
          mantenimientoUnidad: this.fc.mantenimientoUnidad ? this.fc.mantenimientoUnidad.value || null : null,
          ufs: {
            id: this.isNewUfs ? this.nuevoUfsId : this.ultimoContenidoUfs.ufs.id,
            nombre: this.isNewUfs ? 'Nuevo UFS ' + this.nuevoUfsId : this.ultimoContenidoUfs.ufs.nombre,
          },
          estimacionUfs: this.isNewUfs ? null : {
            id: this.ultimoContenidoUfs.estimacionUfs.id,
            proyecto: this.ultimoContenidoUfs.estimacionUfs.proyecto,
            ufs: this.ultimoContenidoUfs.estimacionUfs.ufs,
            actividadesComplementarias: this.ultimoContenidoUfs.estimacionUfs.actividadesComplementarias,
            modelo: this.ultimoContenidoUfs.estimacionUfs.modelo,
            recurso: this.ultimoContenidoUfs.estimacionUfs.recurso,
            fechaCreacion: this.ultimoContenidoUfs.estimacionUfs.fechaCreacion,
            etapaProyecto: this.ultimoContenidoUfs.estimacionUfs.etapaProyecto,
            tipoProyecto: this.ultimoContenidoUfs.estimacionUfs.tipoProyecto
          }
        };

        this.contenidoUfsService.saveContenidoUfs(contenidoUfsData).subscribe(
          (response: any) => {
            console.log(response);
            if (this.isEditing) {
              this.toastr.success('Contenido de UFS actualizado exitosamente.');
            } else {
              this.toastr.success('Contenido de UFS creado exitosamente.');
            }
            this.getContenidoUfs(); // Actualizar la lista de ContenidoUfs después de guardar
            this.resetForm(); // Restablecer el formulario para crear uno nuevo
            this.isEditing = false; // Desactivar el modo de edición
            this.isNewUfs = false; // Desactivar el modo de nuevo UFS
          },
          (error: any) => {
            console.error('Error al guardar el contenido de UFS:', error);
            this.handleSaveError(error);
          }
        );
      } else {
        this.toastr.error('No se pudo obtener el último contenido de UFS o no hay Ufs y/o Estimaciones asociadas.');
      }
    } else {
      this.toastr.error('Por favor completa los campos requeridos.');
    }
  }
  toggleNuevoUfsForm() {
    this.showNuevoUfsForm = !this.showNuevoUfsForm;
  }


handleSaveError(error: any) {
    if (error && error.error && error.error.message) {
        this.toastr.error(`Error: ${error.error.message}`);
    } else {
        this.toastr.error('Error al guardar el contenido de UFS. Por favor, intenta nuevamente más tarde.');
    }
}




  saveFuncion() {
    this.submitted = true;
    if (this.formCreaFuncion.valid) {
      const funcionData = {
        id: 0,
        funcion: this.formCreaFuncion.get('funcion').value,
      };

      this.funcionService.saveFuncion(funcionData).subscribe(
        response => {
          console.log(response);
          this.toastr.success('Función creada exitosamente.');
          this.formCreaFuncion.reset();
          this.getFuncionData();
          this.showCreateFunctionForm = false; // Ocultar el formulario de creación después de guardar
        },
        error => {
          console.error(error);
          this.toastr.error('Error al crear la función');
        }
      );
    } else {
      this.toastr.error('Por favor completa los campos requeridos.');
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.formCreaContenidoUfs.valid) {
      this.saveContenidoUfs();
    } else {
      this.toastr.error('Por favor, complete el formulario correctamente');
    }
  }

  resetForm() {
    this.submitted = false;
    this.formCreaContenidoUfs.reset();
    this.formCrearNuevoUfs.reset();
    this.horasConstruccion = 0;
    this.horasDiseno = 0;
    this.horasPruebas = 0;
    this.totalAjusteDiseno = 0;
    this.totalAjusteConstruccion = 0;
    this.totalAjustePruebas = 0;
    this.isEditing = false;
  
    
  }

  cancelarEdicion() {
    this.isEditing = false;
    this.resetForm();
  }


  resetFormFields() {
    // Reset the values of specific form controls
    this.fc.porcentajeDiseno.setValue('');
    this.fc.porcentajeConstruccion.setValue('');
    this.fc.porcentajePruebas.setValue('');
    this.horasDiseno = 0;
    this.horasConstruccion = 0;
    this.horasPruebas = 0;
    this.totalAjusteDiseno = 0;
    this.totalAjusteConstruccion = 0;
    this.totalAjustePruebas = 0;
  }
}

