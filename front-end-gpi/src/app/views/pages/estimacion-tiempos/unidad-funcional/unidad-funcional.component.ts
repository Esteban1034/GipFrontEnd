

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ContenidoUfs } from 'src/app/model/contenido-ufs';
import { Esfuerzo } from 'src/app/model/esfuerzo';
import { EstimacionTiempos } from 'src/app/model/estimacion-ufs';
import { Funcion } from 'src/app/model/funcion';
import { MantenimientoPesoHora } from 'src/app/model/mantenimiento-peso-hora';
import { MantenimientoUnidad } from 'src/app/model/mantenimiento-unidad';
import { SubFuncion } from 'src/app/model/subFuncion';
import { Ufs } from 'src/app/model/ufs';
import { ContenidoUfsService } from 'src/app/service/contenidoufs.service';
import { EsfuerzoService } from 'src/app/service/esfuerzo.service';
import { FuncionService } from 'src/app/service/funcion.Service';
import { MantenimientoUnidadService } from 'src/app/service/mantenimiento-unidad-service';
import { SubFuncionService } from 'src/app/service/subfuncion.Service copy';

@Component({
  selector: 'app-unidad-funcional',
  templateUrl: './unidad-funcional.component.html',
  styleUrls: ['./unidad-funcional.component.scss']
})
export class formularioUnidadFuncional implements OnInit {
  formCreaContenidoUfs: FormGroup;
  formCrearNuevoUfs: FormGroup;
  formCreaFuncion: FormGroup;

  formSubfuncion: FormGroup;

  ufs: Ufs[] = [];
  estimaciones: EstimacionTiempos[] = [];
  contenidoUfsSeleccionado: ContenidoUfs | null = null;
  mostrarFormularioEdicion: boolean = false;
  esfuerzos: Esfuerzo[] = [];
  funciones: Funcion[] = [];
  subfuncion:SubFuncion[] = [];
  mantenimientos: MantenimientoUnidad[] = [];
  contenidoUfsList: ContenidoUfs[] = [];
  contenidoUfsListf: ContenidoUfs[] = [];
  submitted: boolean = false;
  horasDiseno: number = 0;
  horasConstruccion: number = 0;
  horasPruebas: number = 0;
  totalAjusteDiseno: number = 0;
  totalAjusteConstruccion: number = 0;
  totalAjustePruebas: number = 0;
  showCreateFunctionForm: boolean = false;
  showNuevoUfsForm = false;
  botonNuevoUfsHabilitado = true;
  ultimoIdIncrementado: number | null = null;
  nuevoIdUfs: number = 1; // Declaración inicial
  ultimoContenidoUfs: ContenidoUfs | null = null;
  isEditing = false;
  isNewUfs = false;
  nuevoUfsId = 0;
  lastGeneratedUfsId: number = 1;
  totalPropuesta: number = 0;
  totalDiseno: number = 0;
  totalPruebas: number = 0;
  totalConstruccion: number = 0;
  totalPrueba: number = 0;
  ultimoIdUfsCreado: number = 1;
  subfuncionId: number | undefined; 
  ufsContenidoCounts: any[] = [];
  mantenimientosPorUfs: any[] = [];
  uniqueUfsIds: number[] = [];
  mantenimientosList: MantenimientoUnidad[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private mantenimientoUnidadService: MantenimientoUnidadService,
    private contenidoUfsService: ContenidoUfsService,
    private esfuerzoService: EsfuerzoService,
    private funcionService: FuncionService,
    private subfuncionService:SubFuncionService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.buildForms();
    this.getFuncionData();
    this.getMantenimiento();
    this.getContenidoUfs();
    this.getEsfuerzos();
    this.cargarUltimoContenidoUfs();
    this.buildFormSubfun();
    this.getContenidoUfslist();
    this.getMantenimientosList();
    this.calcularMantenimientosPorUfs();

  }

  buildFormSubfun() {
    this.formSubfuncion = this.formBuilder.group({
      descripcion: ['', Validators.required],
      funcion: ['', Validators.required],
      mantenimientoUnidad:['', Validators.required],
    });
  }

  buildForm() {
    this.formCreaContenidoUfs = this.formBuilder.group({
      nombreCaso: ['', Validators.required],
      porcentajeConstruccion: ['', Validators.required],
      horaConstruccion: [''], // Define este campo si es necesario, según tu lógica
      totalAjusteConstruccion: [''], // Define este campo si es necesario, según tu lógica
      totalConstruccion: [''], // Define este campo si es necesario, según tu lógica
      porcentajeDiseno: ['', Validators.required],
      horaDiseno: [''], // Define este campo si es necesario, según tu lógica
      totalAjusteDiseno: [''], // Define este campo si es necesario, según tu lógica
      totalDiseno: [''], // Define este campo si es necesario, según tu lógica
      porcentajePruebas: ['', Validators.required],
      horaPruebas: [''], // Define este campo si es necesario, según tu lógica
      totalAjustePruebas: [''], // Define este campo si es necesario, según tu lógica
      totalPruebas: [''], // Define este campo si es necesario, según tu lógica
    });
  }
  

 buildForms() {
    this.formCrearNuevoUfs  = this.formBuilder.group({
      nombreCaso: ['', Validators.required],
      porcentajeConstruccion: ['', Validators.required],
      horaConstruccion: [''], // Define este campo si es necesario, según tu lógica
      totalAjusteConstruccion: [''], // Define este campo si es necesario, según tu lógica
      totalConstruccion: [''], // Define este campo si es necesario, según tu lógica
      porcentajeDiseno: ['', Validators.required],
      horaDiseno: [''], // Define este campo si es necesario, según tu lógica
      totalAjusteDiseno: [''], // Define este campo si es necesario, según tu lógica
      totalDiseno: [''], // Define este campo si es necesario, según tu lógica
      porcentajePruebas: ['', Validators.required],
      horaPruebas: [''], // Define este campo si es necesario, según tu lógica
      totalAjustePruebas: [''], // Define este campo si es necesario, según tu lógica
      totalPruebas: [''], // Define este campo si es necesario, según tu lógica
    });
  }
  get fcNuevoUfs() { return this.formCrearNuevoUfs.controls; }
  get fcsub() { return this.formSubfuncion.controls; }

  get fc() { return this.formCreaContenidoUfs.controls; }

  mostrarFormularioNuevoUfs() {
    this.actualizarNuevoIdUfs(); // Actualizar el nuevo ID de UFS al mostrar el formulario


  }

  
  cargarUltimoContenidoUfs() {
    this.contenidoUfsService.getUltimoContenidoUfs().subscribe(
      (ultimoContenido: ContenidoUfs) => {
        this.ultimoContenidoUfs = ultimoContenido;
        this.actualizarNuevoIdUfs();
        this.editarUltimoContenido();
        this.calcularTotales();

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
    
    // Mostrar la alerta con Toastr
    this.toastr.success('', `Siguiente ID de UFS: ${this.nuevoIdUfs}`);
    
    console.log('Siguiente ID de UFS:', this.nuevoIdUfs);
  }
  
  crearNuevoUFS() {
    // Verificar si el formulario de crear nuevo UFS es válido y si tenemos el último contenido de UFS
    if (!this.formCrearNuevoUfs || !this.formCrearNuevoUfs.valid || !this.ultimoContenidoUfs) {
      this.toastr.error('Por favor, completa todos los campos requeridos.');
      return;
    }
  
    // Verificar que tenemos un ID de subfunción válido
    if (!this.subfuncionId) {
      this.toastr.error('No se ha creado una subfunción válida.');
      return;
    }
  
    // Verificar que mantenimientos está definido y no vacío
    if (!this.mantenimientos || this.mantenimientos.length === 0) {
      this.toastr.error('Error: mantenimientos no está definido o está vacío.');
      return;
    }
  
    // Obtener valores del formulario de subfunción de manera segura
    const descripcionSubfuncion = this.formSubfuncion.get('descripcion')?.value || '';
    const funcionSubfuncion = this.formSubfuncion.get('funcion')?.value;
    const mantenimientoUnidadSubfuncion = this.formSubfuncion.get('mantenimientoUnidad')?.value;
  
    // Calcular total de diseño si es necesario según tu lógica
    this.calcularTotalDiseno();
  
    // Crear el nuevo contenido UFS sin asignar los totales con ajuste
    const nuevoContenidoUfs: ContenidoUfs = {
      id: 0, // O asignar el ID correcto según tu lógica de generación de IDs
      nombreCaso: this.fcNuevoUfs.nombreCaso?.value || null,
      porcentajeConstruccion: this.fcNuevoUfs.porcentajeConstruccion?.value || null,
      porcentajeDiseno: this.fcNuevoUfs.porcentajeDiseno?.value || null,
      porcentajePruebas: this.fcNuevoUfs.porcentajePruebas?.value || null,
      totalDiseno: this.totalDiseno || null,
      totalConstruccion: this.totalConstruccion || null,
      totalPruebas: this.totalPruebas || null,
      esfuerzo: null,
      subfuncion: {
        id: this.subfuncionId,
        descripcion: descripcionSubfuncion,
        funcion: funcionSubfuncion,
        mantenimientoUnidad: mantenimientoUnidadSubfuncion,
      },
      ufs: {
        id: this.nuevoIdUfs,
        nombre: `UFS ${this.nuevoIdUfs}`,
      },
      estimacionUfs: this.ultimoContenidoUfs.estimacionUfs // Asigna la estimación UFS del último contenido
    };
  
    // Llamar al servicio para guardar el contenido de UFS
    this.contenidoUfsService.saveContenidoUfs(nuevoContenidoUfs).subscribe(
      (response: any) => {
        console.log(response);
        this.toastr.success('Contenido de UFS creado exitosamente.');
        this.getContenidoUfs(); // Actualizar la lista de contenido de UFS después de guardar
        this.actualizarUltimoIdUfsCreado(); // Actualizar el último ID creado
        this.formSubfuncion.reset(); // Reiniciar el formulario después de guardar
        this.resetForm(); // Restablecer el formulario después de guardar
      },
      (error: any) => {
        console.error('Error al guardar el contenido de UFS:', error);
        this.toastr.error('Error al guardar el contenido de UFS. Por favor, intenta nuevamente.');
      }
    );
  }
  
  
calcularTotalDiseno() {
    this.totalDiseno = this.redondearHoras(Math.abs(this.horasDiseno - this.totalAjusteDiseno));
    this.totalConstruccion = this.redondearHoras(Math.abs(this.horasDiseno - this.totalAjusteConstruccion));
    this.totalPruebas = this.redondearHoras(Math.abs(this.horasDiseno - this.totalAjustePruebas));
  }
  
// Método para calcular el total de ajuste para pruebas
calcularTotalAjusteNu() {
  const porcentajeConstruccion = parseFloat(this.fcNuevoUfs.porcentajeConstruccion.value) || 0;
  const porcentajeDiseno = parseFloat(this.fcNuevoUfs.porcentajeDiseno.value) || 0;
  const porcentajePruebas = parseFloat(this.fcNuevoUfs.porcentajePruebas.value) || 0;  

  this.totalAjusteConstruccion = this.redondearHoras(this.horasConstruccion * (porcentajeConstruccion / 100) + this.horasConstruccion);
  this.totalAjusteDiseno = this.redondearHoras(this.horasDiseno * (porcentajeDiseno / 100) + this.horasDiseno);
  this.totalAjustePruebas = this.redondearHoras(this.horasPruebas * (porcentajePruebas / 100) + this.horasPruebas);

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

  getContenidoUfs() {
    this.contenidoUfsService.getContenidoUfsByUltimoIdEstimacion().subscribe(
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
        subfuncio: this.ultimoContenidoUfs.subfuncion,
     
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
    if (this.formCreaContenidoUfs && this.formCrearNuevoUfs ) { // Verificar si el formulario está inicializado
      this.fc.horaDiseno?.setValue(this.horasDiseno); // Usar el operador ? para acceder a setValue de manera segura
      this.fc.horaConstruccion?.setValue(this.horasConstruccion);
      this.fc.horaPruebas?.setValue(this.horasPruebas);
      this.fcNuevoUfs.horaDiseno?.setValue(this.horasDiseno); // Usar el operador ? para acceder a setValue de manera segura
      this.fcNuevoUfs.horaConstruccion?.setValue(this.horasConstruccion);
      this.fcNuevoUfs.horaPruebas?.setValue(this.horasPruebas);
      this.calcularTotales();

    } else {
      console.error('El formulario formCreaContenidoUfs no está inicializado.');
    }
  }

  calcularTotales() {
    const porcentajeConstruccion = parseFloat(this.fc.porcentajeConstruccion.value) || 0;
    const porcentajeDiseno = parseFloat(this.fc.porcentajeDiseno.value) || 0;
    const porcentajePruebas = parseFloat(this.fc.porcentajePruebas.value) || 0;  
 
 
    this.totalAjusteConstruccion = this.redondearHoras(this.horasConstruccion * (porcentajeConstruccion / 100) + this.horasConstruccion);
    this.totalAjusteDiseno = this.redondearHoras(this.horasDiseno * (porcentajeDiseno / 100) + this.horasDiseno);
    this.totalAjustePruebas = this.redondearHoras(this.horasPruebas * (porcentajePruebas / 100) + this.horasPruebas);
  

  }
  onChangePorcentaje(event: any) {
    // Recalcular totales al cambiar los porcentajes
    this.calcularTotales();
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
          this.actualizarValoresFormulario();
          this.calcularTotales();
        },
        (error) => {
          console.error('Error al obtener horas:', error);
          this.toastr.error('Error al obtener las horas del mantenimiento');
        }
      );
    } else {
      console.error('No se encontró el mantenimiento seleccionado');
      this.resetFormFields();
    }
  }
  saveContenidoUfs() {
    this.submitted = true;
  
    // Verificar si el formulario de creación de contenido de UFS es válido
    if (!this.formCreaContenidoUfs || !this.formCreaContenidoUfs.valid) {
      this.toastr.error('Por favor completa los campos requeridos en el formulario de Contenido UFS.');
      return;
    }
  
    // Verificar que tenemos el último contenido de UFS y su ID asociado
    if (!this.ultimoContenidoUfs || !this.ultimoContenidoUfs.ufs || !this.ultimoContenidoUfs.ufs.id) {
      this.toastr.error('No se pudo obtener el último contenido de UFS o no hay Ufs y/o Estimaciones asociadas.');
      return;
    }
  
    // Verificar que tenemos un ID de subfunción válido
    if (!this.subfuncionId) {
      this.toastr.error('No se ha creado una subfunción válida.');
      return;
    }
  
    // Verificar que mantenimientos está definido y no vacío
    if (!this.mantenimientos || this.mantenimientos.length === 0) {
      this.toastr.error('Error: mantenimientos no está definido o está vacío.');
      return;
    }
  
    // Obtener valores del formulario de subfunción de manera segura
    const descripcionSubfuncion = this.formSubfuncion?.get('descripcion')?.value || '';
    const funcionSubfuncion = this.formSubfuncion?.get('funcion')?.value;
    const mantenimientoUnidadSubfuncion = this.formSubfuncion?.get('mantenimientoUnidad')?.value;
  
    // Verificar que formSubfuncion esté definido y sea válido
    if (!this.formSubfuncion || !this.formSubfuncion.valid) {
      this.toastr.error('Error en el formulario de subfunción. Por favor revisa los campos.');
      return;
    }
  
    // Construir el objeto de ContenidoUfs a guardar
    this.calcularTotalesCon();
  
    const contenidoUfsData: ContenidoUfs = {
      id: this.isEditing ? this.ultimoContenidoUfs.id : 0,
      nombreCaso: this.fc.nombreCaso ? this.fc.nombreCaso.value || null : null,
      porcentajeConstruccion: this.fc.porcentajeConstruccion ? this.fc.porcentajeConstruccion.value || null : null,
      porcentajeDiseno: this.fc.porcentajeDiseno ? this.fc.porcentajeDiseno.value || null : null,
      porcentajePruebas: this.fc.porcentajePruebas ? this.fc.porcentajePruebas.value || null : null,
      totalDiseno: this.totalDiseno || null,
      totalConstruccion: this.totalConstruccion || null,
      totalPruebas: this.totalPruebas || null,
      esfuerzo: null,
      subfuncion: {
        id: this.subfuncionId,
        descripcion: descripcionSubfuncion,
        funcion: funcionSubfuncion,
        mantenimientoUnidad: mantenimientoUnidadSubfuncion,
      },
      ufs: {
        id: this.ultimoContenidoUfs.ufs.id,
        nombre: this.ultimoContenidoUfs.ufs.nombre,
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
  
    console.log('ContenidoUfs Data:', contenidoUfsData); // Verifica en la consola que todos los datos estén correctos
  
    // Llamar al servicio para guardar el contenido de UFS
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
        this.formSubfuncion?.reset(); // Reiniciar el formulario después de guardar
  
        this.isEditing = false; // Desactivar el modo de edición
        this.isNewUfs = false; // Desactivar el modo de nuevo UFS
      },
      (error: any) => {
        console.error('Error al guardar el contenido de UFS:', error);
        this.toastr.error('Error al guardar el contenido de UFS. Por favor, intenta nuevamente.');
        // Puedes agregar aquí un manejo de errores más específico si es necesario
      }
    );
  }
  
  getContenidoUfslist() {
    this.contenidoUfsService.getContenidoUfsByUltimoIdEstimacion().subscribe(
      (data: ContenidoUfs[]) => {
        this.contenidoUfsListf = data;
  
        // Obtener los IDs de UFS únicos creados en esta estimación
        const uniqueUfsIds = [...new Set(this.contenidoUfsListf.map(c => c.ufs.id))];
  
        // Guardar los IDs de UFS únicos
        this.uniqueUfsIds = uniqueUfsIds;
  
        // Llamar función para obtener los mantenimientos
        this.getMantenimientosList();
      },
      error => {
        console.error(error);
        this.toastr.error('Error al obtener los datos de contenido de unidades funcionales');
      }
    );
  }
  getMantenimientosList() {
    this.mantenimientoUnidadService.getMantenimientos().subscribe(
      (data: MantenimientoUnidad[]) => {
        this.mantenimientosList = data;
  
        // Calcular mantenimientos por UFS
        this.calcularMantenimientosPorUfs();
      },
      error => {
        console.error(error);
        this.toastr.error('Error al obtener los datos de mantenimiento de unidad');
      }
    );
  }

  
  calcularMantenimientosPorUfs() {
 
    this.mantenimientosPorUfs = this.mantenimientosList.map(mantenimiento => {
      const ufsCounts = this.uniqueUfsIds.map(ufsId => {
        const count = this.contenidoUfsListf.filter(c =>
          c.ufs.id === ufsId && c.subfuncion?.mantenimientoUnidad?.id === mantenimiento.id
        ).length;
        return { ufsId, count };
      });
  
      return {
        nombre: mantenimiento.nombre,
        peso: mantenimiento.peso,
        ufsCounts
      };
    });}
  calcularTotalesCon() {
    this.totalDiseno = this.redondearHoras(Math.abs(this.horasDiseno - this.totalAjusteDiseno));
    this.totalConstruccion = this.redondearHoras(Math.abs(this.horasDiseno - this.totalAjusteConstruccion));
    this.totalPruebas = this.redondearHoras(Math.abs(this.horasDiseno - this.totalAjustePruebas));
  }
  
  
  
  
  
  toggleNuevoUfsForm() {
    this.showNuevoUfsForm = !this.showNuevoUfsForm;
    // Ocultar el botón después de hacer clic
    document.getElementById('botonCrearUfs').style.display = 'none';
  }
handleSaveError(error: any) {
    if (error && error.error && error.error.message) {
        this.toastr.error(`Error: ${error.error.message}`);
    } else {
        this.toastr.error('Error al guardar el contenido de UFS. Por favor, intenta nuevamente más tarde.');
    }
}
saveSubfuncion() {
  this.submitted = true;

  // Verificar que formSubfuncion esté definido y sea válido
  if (!this.formSubfuncion || !this.formSubfuncion.valid) {
    this.toastr.error('Por favor completa todos los campos requeridos en el formulario de Subfunción.');
    return;
  }

  // Obtener valores del formulario de subfunción de manera segura
  const descripcionSubfuncion = this.formSubfuncion.get('descripcion')?.value || '';
  const funcionSubfuncion = this.formSubfuncion.get('funcion')?.value;
  const mantenimientoUnidadSubfuncion = this.formSubfuncion.get('mantenimientoUnidad')?.value;

  const subfuncionData = {
    id: 0, // Asigna el ID adecuadamente según tu lógica de generación de IDs
    descripcion: descripcionSubfuncion,
    funcion: funcionSubfuncion,
    mantenimientoUnidad: mantenimientoUnidadSubfuncion,
  };

  console.log(subfuncionData); // Verifica en la consola que todos los datos estén correctos

  // Llama al servicio para guardar la Subfuncion
  this.subfuncionService.createSubfuncion(subfuncionData).subscribe(
    (response: any) => {
      console.log(response);
      this.subfuncionId = response.id; // Asignación de subfuncionId
      this.toastr.success('Subfunción creada exitosamente.');
    },
    (error: any) => {
      console.error('Error al guardar la subfunción:', error);
      this.toastr.error('Error al guardar la subfunción. Por favor, intenta nuevamente.');
    }
  );
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

