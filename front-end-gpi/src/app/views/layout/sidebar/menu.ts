import { MenuItem } from './menu.model';

export const MENU_ADMIN: MenuItem[] = [
    {
        label: 'Principal',
        isTitle: true
    },
    {
        label: 'Inicio',
        icon: 'home',
        link: '/dashboard'
    },
    {
        label: 'Administracion',
        isTitle: true
    },
    {
        label: 'Clientes',
        icon: 'users',
        subItems: [
            {
                label: 'Crear cliente',
                link: '/clientes/nuevo'
            },
            {
                label: 'Ver todos',
                link: '/clientes'
            }
        ]
    },
    {
        label: 'Recursos',
        icon: 'droplet',
        subItems: [
            {
                label: 'Crear recurso',
                link: '/recursos/nuevo'
            },
            {
                label: 'Ver todos',
                link: '/recursos'
            },
            {
                label: 'Novedades',
                link: '/recursos/novedades'
            }
        ]
    },
    {
        label: 'Reporte tiempos',
        icon: 'compass',
        subItems: [
            {
                label: 'Nuevo reporte',
                link: '/reporte-tiempo/nuevo'
            },
            {
                label: 'Reportes pendientes',
                link: '/reporte-tiempo/pendientes-devueltos'
            },
            {
                label: 'Tiempos reportados',
                link: '/reporte-tiempo/horas-reportadas'
            },
            {
                label: 'Aprobar tiempo',
                link: '/reporte-tiempo/aprobar-tiempo-list'
            },
            {
                label: 'Mis reportes',
                link: '/reporte-tiempo/mis-reportes'
            }
        ]
    },
    {
        label: 'Proyectos',
        icon: 'briefcase',
        subItems: [
            {
                label: 'Nuevo proyecto',
                link: '/proyectos/nuevo'
            },
            {
                label: 'Ver todos',
                link: '/proyectos'
            },
            {
                label: 'Proyectos internos',
                link: '/proyectos/internos'
            },
            {
                label: 'Project Status Report',
                subItems: [
                    {
                        label: 'Crear PSR',
                        link: '/psr'
                    },
                    {
                        label: 'Consultar PSR',
                        link: '/psr/consultar'
                    }
                ]
            }
        ]
    },
    {
        label: 'Reportes',
        isTitle: true
    },
    {
        label: 'Facturacion cliente',
        icon: 'check-square',
        link: '/reportes/clientes/facturacion'
    },
    {
        label: 'Tiempos r. cliente',
        icon: 'check-square',
        link: '/reportes/clientes/tiempos-reportados'
    },
    {
        label: 'Proyecto recursos',
        icon: 'check-square',
        link: '/reportes/proyectos/tiempos-reportados'
    },
    {
        label: 'Tiempos r. empleado',
        icon: 'check-square',
        link: '/reportes/reporte-tiempos/tiempos-reportados/empleado'
    },
    {
        label: 'Empleados sin reportes',
        icon: 'check-square',
        link: '/reportes/reporte-tiempos/reportes-pendientes-empleado'
    }
];



export const MENU_DP: MenuItem[] = [
    {
        label: 'Principal',
        isTitle: true
    },
    {
        label: 'Inicio',
        icon: 'home',
        link: '/dashboard'
    },
    {
        label: 'Administracion',
        isTitle: true
    },
    {
        label: 'Clientes',
        icon: 'users',
        subItems: [
            {
                label: 'Crear cliente',
                link: '/clientes/nuevo'
            },
            {
                label: 'Ver todos',
                link: '/clientes'
            }
        ]
    },
    {
        label: 'Recursos',
        icon: 'droplet',
        subItems: [
            {
                label: 'Crear recurso',
                link: '/recursos/nuevo'
            },
            {
                label: 'Ver todos',
                link: '/recursos'
            },
            {
                label: 'Novedades',
                link: '/recursos/novedades'
            }
        ]
    },
    {
        label: 'Proyectos',
        icon: 'briefcase',
        subItems: [
            {
                label: 'Nuevo proyecto',
                link: '/proyectos/nuevo'
            },
            {
                label: 'Ver todos',
                link: '/proyectos'
            },
            {
                label: 'Proyectos internos',
                link: '/proyectos/internos'
            }, 
            {
                label: 'Matriz de tiempos',
                subItems: [
                    {
                        label: 'Actualizar parámetros',
                        link: '/parametria-matriz-tiempos'
                    },
                    {
                        label: 'Generar matriz de tiempos',
                        link: '/generacion-matriz-tiempos'
                    },
                    {
                        label: 'Matrices históricas',
                        link: '/generacion-informes-historicos'
                    }
                ]
            },  
            {
                label: 'Project Status Report',
                subItems: [
                    {
                        label: 'Crear PSR',
                        link: '/psr'
                    },
                    {
                        label: 'Consultar PSR',
                        link: '/psr/consultar'
                    }
                ]
            },
            {
                label: 'Estimación Tiempos',
                subItems: [
                    {
                        label: 'Estimaciones',
                        link: '/estimacion tiempos/estimaciones'
                    },
                    {
                        label: 'Mantenimiento Peso Hora',
                        link: '/estimacion tiempos/mant-peso-hora'
                    },
                    {
                        label: 'Unidad Programación',
                        link: '/estimacion tiempos/mant-unidad-programacion'
                    },
                    {
                        label: 'Direccionamiento Test',
                        link: '/estimacion tiempos/formulario-datosBasicos-proyecto'
                    }
                ]
            }
        ]
    },
    {
        label: 'Reporte tiempos',
        icon: 'compass',
        subItems: [
            {
                label: 'Nuevo reporte',
                link: '/reporte-tiempo/nuevo'
            },
            {
                label: 'Reportes pendientes',
                link: '/reporte-tiempo/pendientes-devueltos'
            },
            {
                label: 'Tiempos reportados',
                link: '/reporte-tiempo/horas-reportadas'
            },
            {
                label: 'Aprobar tiempo',
                link: '/reporte-tiempo/aprobar-tiempo-list'
            },
            {
                label: 'Mis reportes',
                link: '/reporte-tiempo/mis-reportes'
            }
        ]
    },
    {
        label: 'Reportes',
        isTitle: true
    },
    {
        label: 'Facturacion cliente',
        icon: 'check-square',
        link: '/reportes/clientes/facturacion'
    },
    {
        label: 'Tiempos r. cliente',
        icon: 'check-square',
        link: '/reportes/clientes/tiempos-reportados'
    },
    {
        label: 'Proyecto recursos',
        icon: 'check-square',
        link: '/reportes/proyectos/tiempos-reportados'
    },
    {
        label: 'Tiempos r. empleado',
        icon: 'check-square',
        link: '/reportes/reporte-tiempos/tiempos-reportados/empleado'
    },
    {
        label: 'Empleados sin reportes',
        icon: 'check-square',
        link: '/reportes/reporte-tiempos/reportes-pendientes-empleado'
    }
];


export const MENU_GP: MenuItem[] = [
    {
        label: 'Principal',
        isTitle: true
    },
    {
        label: 'Inicio',
        icon: 'home',
        link: '/dashboard'
    },
    {
        label: 'Administracion',
        isTitle: true
    },
    {
        label: 'Clientes',
        icon: 'users',
        subItems: [
            {
                label: 'Crear cliente',
                link: '/clientes/nuevo'
            },
            {
                label: 'Ver todos',
                link: '/clientes'
            }
        ]
    },
    {
        label: 'Recursos',
        icon: 'droplet',
        subItems: [
            {
                label: 'Crear recurso',
                link: '/recursos/nuevo'
            },
            {
                label: 'Ver todos',
                link: '/recursos'
            },
            {
                label: 'Novedades',
                link: '/recursos/novedades'
            }
        ]
    },
    {
        label: 'Proyectos',
        icon: 'briefcase',
        subItems: [
            {
                label: 'Nuevo proyecto',
                link: '/proyectos/nuevo'
            },
            {
                label: 'Ver todos',
                link: '/proyectos'
            },
            {
                label: 'Proyectos internos',
                link: '/proyectos/internos'
            },
            {
                label: 'Project Status Report',
                subItems: [
                    {
                        label: 'Consultar PSR',
                        link: '/psr/consultar'
                    }
                ]
            }
        ]
    },
    {
        label: 'Reporte tiempos',
        icon: 'compass',
        subItems: [
            {
                label: 'Nuevo reporte',
                link: '/reporte-tiempo/nuevo'
            },
            {
                label: 'Reportes pendientes',
                link: '/reporte-tiempo/pendientes-devueltos'
            },
            {
                label: 'Tiempos reportados',
                link: '/reporte-tiempo/horas-reportadas'
            },
            {
                label: 'Aprobar tiempo',
                link: '/reporte-tiempo/aprobar-tiempo-list'
            },
            {
                label: 'Mis reportes',
                link: '/reporte-tiempo/mis-reportes'
            }
        ]
    },
    {
        label: 'Reportes',
        isTitle: true
    },
    {
        label: 'Facturacion cliente',
        icon: 'check-square',
        link: '/reportes/clientes/facturacion'
    },
    {
        label: 'Tiempos r. cliente',
        icon: 'check-square',
        link: '/reportes/clientes/tiempos-reportados'
    },
    {
        label: 'Proyecto recursos',
        icon: 'check-square',
        link: '/reportes/proyectos/tiempos-reportados'
    },
    {
        label: 'Tiempos r. empleado',
        icon: 'check-square',
        link: '/reportes/reporte-tiempos/tiempos-reportados/empleado'
    },
    {
        label: 'Empleados sin reportes',
        icon: 'check-square',
        link: '/reportes/reporte-tiempos/reportes-pendientes-empleado'
    }
];

export const MENU_LP: MenuItem[] = [
    {
        label: 'Principal',
        isTitle: true
    },
    {
        label: 'Inicio',
        icon: 'home',
        link: '/dashboard'
    },
    {
        label: 'Administracion',
        isTitle: true
    },
    {
        label: 'Clientes',
        icon: 'users',
        subItems: [
            {
                label: 'Ver todos',
                link: '/clientes'
            }
        ]
    },
    {
        label: 'Recursos',
        icon: 'droplet',
        subItems: [
            {
                label: 'Crear recurso',
                link: '/recursos/nuevo'
            },
            {
                label: 'Ver todos',
                link: '/recursos'
            },
            {
                label: 'Novedades',
                link: '/recursos/novedades'
            }
        ]
    },
    {
        label: 'Proyectos',
        icon: 'briefcase',
        subItems: [
            {
                label: 'Ver todos',
                link: '/proyectos'
            },
            {
                label: 'Project Status Report',
                subItems: [
                    {
                        label: 'Consultar PSR',
                        link: '/psr/consultar'
                    }
                ]
            }
        ]
    },
    {
        label: 'Reporte tiempos',
        icon: 'compass',
        subItems: [
            {
                label: 'Nuevo reporte',
                link: '/reporte-tiempo/nuevo'
            },
            {
                label: 'Reportes pendientes',
                link: '/reporte-tiempo/pendientes-devueltos'
            },
            {
                label: 'Tiempos reportados',
                link: '/reporte-tiempo/horas-reportadas'
            },
            {
                label: 'Aprobar tiempo',
                link: '/reporte-tiempo/aprobar-tiempo-list'
            },
            {
                label: 'Mis reportes',
                link: '/reporte-tiempo/mis-reportes'
            }
        ]
    },

    
    {
        label: 'Reportes',
        isTitle: true
    },
    {
        label: 'Proyecto recursos',
        icon: 'check-square',
        link: '/reportes/proyectos/tiempos-reportados'
    },
    {
        label: 'Tiempos r. empleado',
        icon: 'check-square',
        link: '/reportes/reporte-tiempos/tiempos-reportados/empleado'
    }
];

export const MENU_USER: MenuItem[] = [
    {
        label: 'Principal',
        isTitle: true
    },
    {
        label: 'Inicio',
        icon: 'home',
        link: '/dashboard'
    },
    {
        label: 'Administracion',
        isTitle: true
    },
    {
        label: 'Reporte tiempos',
        icon: 'compass',
        subItems: [
            {
                label: 'Nuevo reporte',
                link: '/reporte-tiempo/nuevo'
            },
            {
                label: 'Reportes pendientes',
                link: '/reporte-tiempo/pendientes-devueltos'
            },
            {
                label: 'Mis reportes',
                link: '/reporte-tiempo/mis-reportes'
            }
        ]
    }
];

export const ROL_QA: MenuItem[] = [
    {
        label: 'Principal',
        isTitle: true
    },
    {
        label: 'Inicio',
        icon: 'home',
        link: '/dashboard'
    },
    {
        label: 'Administracion',
        isTitle: true
    },
    {
        label: 'Matriz de tiempos',
        subItems: [
            {
                label: 'Actualizar parámetros',
                link: '/parametria-matriz-tiempos'
            },
            {
                label: 'Generar matriz de tiempos',
                link: '/generacion-matriz-tiempos'
            },
            {
                label: 'Matrices históricas',
                link: '/generacion-informes-historicos'
            }
        ]
    }
];
