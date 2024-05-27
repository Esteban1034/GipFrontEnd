import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseComponent } from './views/layout/base/base.component';
import { AuthGuard } from './core/guard/auth.guard';
import { ErrorPageComponent } from './views/pages/error-page/error-page.component';
import { ListClientesComponent } from './views/pages/clientes/list-clientes/list-clientes.component';
import { FormClientesComponent } from './views/pages/clientes/form-clientes/form-clientes.component';
import { ListRecursosComponent } from './views/pages/recursos/list-recursos/list-recursos.component';
import { FormRecursosComponent } from './views/pages/recursos/form-recursos/form-recursos.component';
import { HorasReportadasComponent } from './views/pages/reporte-tiempos/horas-reportadas/horas-reportadas.component';
import { AprobarTiempoComponent } from './views/pages/reporte-tiempos/aprobar-tiempo/aprobar-tiempo.component';
import { ListProyectoComponent } from './views/pages/proyectos/list-proyectos/list-proyectos.component';
import { FormProyectoComponent } from './views/pages/proyectos/form-proyecto/form-proyecto.component';
import { UpdateProyectoComponent } from './views/pages/proyectos/update-proyecto/update-proyecto.component';
import { ProgramarFacturacionComponent } from './views/pages/facturacion/programar-facturacion/programar-facturacion.component';
import { UpdateClientesComponent } from './views/pages/clientes/update-clientes/update-clientes.component';
import { FormReporteComponent } from './views/pages/reporte-tiempos/form-reporte/form-reporte.component';
import { PlaneacionComponent } from './views/pages/planeacion/planeacion.component';
import { NovedadesComponent } from './views/pages/novedades/novedades.component';
import { UpdateRecursoComponent } from './views/pages/recursos/update-recurso/update-recurso.component';
import { DetalleAprobarTiempoComponent } from './views/pages/reporte-tiempos/detalle-aprobar-tiempo/detalle-aprobar-tiempo.component';
import { ActividadesComponent } from './views/pages/planeacion/actividades/actividades.component';
import { FasesComponent } from './views/pages/planeacion/fases/fases.component';
import { ReportesPendientesDevueltosComponent } from './views/pages/reporte-tiempos/reportes-pendientes-devueltos/reportes-pendientes-devueltos.component';
import { ReporteTiemposReportadosEmpleadoComponent } from './views/pages/reportes-consultas/reporte-tiempos-reportados-empleado/reporte-tiempos-reportados-empleado.component';
import { ReporteFacturacionClienteComponent } from './views/pages/reportes-consultas/reporte-facturacion-cliente/reporte-facturacion-cliente.component';
import { ReporteTiempoClienteComponent } from './views/pages/reportes-consultas/reporte-tiempo-cliente/reporte-tiempo-cliente.component';
import { ReporteProyectoRecursoComponent } from './views/pages/reportes-consultas/reporte-proyecto-recurso/reporte-proyecto-recurso.component';
import { MisReportesComponent } from './views/pages/reporte-tiempos/mis-reportes/mis-reportes.component';
import { ListProyectosIntComponent } from './views/pages/proyectos/proyectos-internos/list-proyectos-int/list-proyectos-int.component';
import { FormProyectoIntComponent } from './views/pages/proyectos/proyectos-internos/form-proyecto-int/form-proyecto-int.component';
import { UpdateProyectoIntComponent } from './views/pages/proyectos/proyectos-internos/update-proyecto-int/update-proyecto-int.component';
import { ReporteTiemposPendientesEmpleadosComponent } from './views/pages/reportes-consultas/reporte-tiempos-pendientes-empleados/reporte-tiempos-pendientes-empleados.component';
import { CrearPsrComponent } from './views/pages/project-status-report/crear-psr/crear-psr.component';
import { ListPsrComponent } from './views/pages/project-status-report/list-psr/list-psr.component';
import { InformePsrComponent } from './views/pages/informes/informe-psr/informe-psr.component'
import { ParametriaMatrizTiempos } from './views/pages/parametria-matriz-tiempos/parametria-matriz-tiempos.component';
import { GeneracionMatrizTiempos } from './views/pages/parametria-matriz-tiempos/generacion-matriz-tiempos/generacion-matriz-tiempos.component';
import { GenracionInfotmesHistoricos } from './views/pages/parametria-matriz-tiempos/infomes-historicos/generacion-informes-historicos.component';
import { GestionRol } from './views/pages/gestion-usuario-rol/gestion-rol/gestion-rol.component';
import { ExitGuard } from './views/pages/project-status-report/exit.guard';

const routes: Routes = [
    { path: 'auth', loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule) },
    {
        path: '',
        component: BaseComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./views/pages/dashboard/dashboard.module').then(m => m.DashboardModule)
            },
            {
                path: 'clientes', component: ListClientesComponent
            },
            {
                path: 'clientes/editar/:id', component: UpdateClientesComponent
            },
            {
                path: 'clientes/nuevo', component: FormClientesComponent
            },
            {
                path: 'recursos', component: ListRecursosComponent
            },
            {
                path: 'recursos/editar/:id', component: UpdateRecursoComponent
            },
            {
                path: 'recursos/nuevo', component: FormRecursosComponent
            },
            {
                path: 'recursos/novedades', component: NovedadesComponent
            },
            {
                path: 'gestion-rol', component: GestionRol
            },
            {
                path: 'reporte-tiempo/nuevo', component: FormReporteComponent
            },
            {
                path: 'reporte-tiempo/horas-reportadas', component: HorasReportadasComponent
            },
            {
                path: 'reporte-tiempo/aprobar-tiempo-list', component: AprobarTiempoComponent
            },
            {
                path: 'reporte-tiempo/aprobar-tiempo/:id', component: DetalleAprobarTiempoComponent
            },
            {
                path: 'reporte-tiempo/pendientes-devueltos', component: ReportesPendientesDevueltosComponent
            },
            {
                path: 'reporte-tiempo/mis-reportes', component: MisReportesComponent
            },
            {
                path: 'proyectos', component: ListProyectoComponent
            },
            {
                path: 'proyectos/nuevo', component: FormProyectoComponent
            },
            {
                path: 'proyectos/editar/:id', component: UpdateProyectoComponent
            },
            {
                path: 'proyectos/facturacion/programar/:id', component: ProgramarFacturacionComponent
            },
            {
                path: 'proyectos/planeacion/:id', component: PlaneacionComponent
            },
            {
                path: 'proyectos/planeacion/list-proyectos', component: ListProyectoComponent
            },
            {
                path: 'proyectos/admon/fases', component: FasesComponent
            },
            {
                path: 'proyectos/admon/actividades', component: ActividadesComponent
            },
            {
                path: 'proyectos/internos', component: ListProyectosIntComponent
            },
            {
                path: 'proyectos/internos/nuevo', component: FormProyectoIntComponent
            },
            {
                path: 'proyectos/internos/editar/:id', component: UpdateProyectoIntComponent
            },
            {
                path: 'reportes/reporte-tiempos/tiempos-reportados/empleado', component: ReporteTiemposReportadosEmpleadoComponent
            },
            {
                path: 'reportes/clientes/facturacion', component: ReporteFacturacionClienteComponent
            },
            {
                path: 'reportes/clientes/tiempos-reportados', component: ReporteTiempoClienteComponent
            },
            {
                path: 'reportes/proyectos/tiempos-reportados', component: ReporteProyectoRecursoComponent
            },
            {
                path: 'reportes/reporte-tiempos/reportes-pendientes-empleado', component: ReporteTiemposPendientesEmpleadosComponent
            },
            {
                path: 'psr', component: CrearPsrComponent,
                canDeactivate: [ExitGuard]
            },
            {
                path: 'psr/consultar', component: ListPsrComponent
            },
            {
                path: 'informes/informe-psr', component: InformePsrComponent
            },
            {
                path: 'parametria-matriz-tiempos', component: ParametriaMatrizTiempos
            },
            {
                path: 'generacion-matriz-tiempos', component: GeneracionMatrizTiempos
            },
            {
                path: 'generacion-informes-historicos', component: GenracionInfotmesHistoricos
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    {
        path: 'error',
        component: ErrorPageComponent,
        data: {
            'type': 404,
            'title': 'Page Not Found',
            'desc': 'Oopps!! The page you were looking for doesn\'t exist.'
        }
    },
    {
        path: 'error/:type',
        component: ErrorPageComponent
    },
    { path: '**', redirectTo: 'error', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
