import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import feather from 'feather-icons';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { environment } from "src/environments/environment";
import { Utils } from 'src/app/core/util/util';
import { GestionUsuariosRoles } from 'src/app/service/gestion-usuario-roles.service';
import { Submenu } from 'src/app/model/submenu';
import { SubmenuRol } from 'src/app/model/submenu-rol';
import { RolSeg } from 'src/app/model/rol-seg';
import { Usuario } from 'src/app/model/usuario';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Item } from 'src/app/model/item';


@Component({
  selector: 'app-gestion-rol',
  templateUrl: './gestion-rol.component.html',
  styleUrls: ['./gestion-rol.component.scss']
})

export class GestionRol implements OnInit {

  validaciones = Utils.validaciones;
  roles: RolSeg[]
  people: any = [];
  selectedRolId: number = null;
  usuario: Usuario;
  titulo: string;
  submenus: Submenu[] = [];
  nombreRol: string;
  rolEditando: RolSeg;
  descRol: string;
  loadingIndicator = true;
  columnMode = ColumnMode;
  parametroBuscar: string
  rolesCompletos: RolSeg[]
  nroPaginas = 10;
  selectedTipolId: number = 0;
  dataSource = null;
  rolEdit: boolean = false;
  @ViewChild(MatSort) sort: MatSort

  constructor(private gestionUsuariosRoles: GestionUsuariosRoles, private modalService: NgbModal, private toastr: ToastrService) { }

  columnas: string[] = ['nombre', 'descripcion', 'permisos'];
  session = localStorage.getItem('session');

  ngOnInit(): void {
    this.submenus.push(new Submenu())
    this.listarRoles()
  }

  listarRoles() {
    this.gestionUsuariosRoles.obtenerRoles().subscribe(roles => {
      this.roles = roles;
      this.rolesCompletos = [...this.roles];

      this.dataSource = new MatTableDataSource(this.roles);
      this.dataSource.sort = this.sort;
    })
  }
  registrarRol(): void {
    let rol: RolSeg;
    rol = this.armarNuevoRol();
    this.gestionUsuariosRoles.registrarRol(rol).subscribe(
      response => {
        this.modalService.dismissAll();
        this.listarRoles();
        this.toastr.success('Rol guardado/actualizado correctamente.');
      }, err => {
        this.toastr.error('Error al guardar/actualizar rol ');
      }
    )
  }

  editarRol(content, rol): void {
    this.nombreRol = "";
    this.descRol = "";
    this.consultarSubmenu(rol);
    this.titulo = rol == null ? "Crear Rol" : "Editar Rol"
    this.rolEdit = this.titulo == "Editar Rol" ? true : false;
    this.rolEditando = rol//==null?0:rol
    this.modalService.open(content, { size: 'xl' }).result.then((result) => {

    }).catch((res) => { });
  }

  consultarSubmenu(rol: RolSeg) {
    this.gestionUsuariosRoles.listarMenuOpciones().subscribe(
      submenu => {
        this.submenus = submenu;
        feather.replace();
        if (rol != null) {
          this.armarMenuActual(rol)
        }
      }, err => {
        this.toastr.error("Error al listar las opciones " + err.error.error);
      }
    )
  }

  mostarIcono() {
    feather.replace();
  }

  cambiarEstados(submenu): void {
    submenu.items.forEach((item) => {
      item.seleccionado = submenu.seleccionado;
      item.subItems.forEach((subitem) => {
        subitem.seleccionado = item.seleccionado;
      })
    })
  }

  armarNuevoRol(): RolSeg {
    let rol: RolSeg = new RolSeg();
    rol.rolId = this.rolEditando == null ? 0 : this.rolEditando.rolId;
    let submenuLista: Submenu[] = [];
    let submenusLista = [...this.submenus]//structuredClone(this.submenus);
    let submenuRolLista: SubmenuRol[] = []
    let submenuRol = new SubmenuRol();

    submenuLista = submenusLista.filter((submenu) => {
      if (submenu.seleccionado) {
        return submenu
      } else {
        let items = [];
        items = submenu.items.filter(item => {
          let subitems = [];
          subitems = item.subItems.filter(subitem => {
            return subitem.seleccionado;
          })
          if (subitems.length > 0) {
            return item.subItems = subitems;
          }
          return item.seleccionado;
        })
        if (items.length > 0) {
          return submenu.items = items;
        }
      }
    });
    submenuLista.forEach((submenu) => {
      submenuRol = new SubmenuRol();
      submenuRol.submenu = submenu;
      submenuRolLista.push(submenuRol)
    })
    rol.rolNombre = this.nombreRol.toUpperCase();
    rol.rolDescripcion = this.descRol;
    rol.submenuRoles = submenuRolLista;
    return rol
  }

  armarMenuActual(rol: RolSeg): void {
    let idsItems: number[] = [];
    let idsSubItems: number[] = [];
    let idsSubmenu: number[] = [];
    rol.submenuRoles.forEach(submenuRol => {
      if (submenuRol.submenu.items.length == submenuRol.itemRol.length) {
        idsSubmenu.push(submenuRol.submenu.id);
      }
      submenuRol.itemRol.forEach((item) => {
        idsItems.push(item.item.id);
        if (item.subItemRol) {
          item.subItemRol.forEach((subitem) => {
            idsSubItems.push(subitem.subItem.id);
          });
        }
      })
    })

    this.submenus.forEach(submenu => {
      submenu.items.forEach(item => {
        if (idsItems.includes(item.id)) {
          item.seleccionado = true
        }
        item.subItems.forEach(subitem => {
          if (idsSubItems.includes(subitem.id)) {
            subitem.seleccionado = true
          }
          return subitem;
        })
        return item;
      })
      if (idsSubmenu.includes(submenu.id)) {
        return submenu.seleccionado = true
      }
    })
    this.nombreRol = rol.rolNombre
    this.descRol = rol.rolDescripcion
  }


  cambiarEstadoSubmenu(submenu: Submenu): void {
    let contador = 0;
    submenu.items.forEach((item) => {
      if (item.seleccionado) {
        contador++
      }
    })
    if (contador == submenu.items.length) {
      submenu.seleccionado = true
    } else {
      submenu.seleccionado = false
    }

    submenu.items.forEach((item) => {
      item.subItems.forEach((subitem) => {
        subitem.seleccionado = item.seleccionado;
      })
    })
  }

  cambiarEstadoItem(item: Item): void {
    let contador = 0;
    
    item.subItems.forEach((subitem) => {
      if (subitem.seleccionado) {
        contador++
      }
    })
    if (contador === item.subItems.length) {
      item.seleccionado = true
    } else {
      item.seleccionado = false
    }
  }

  buscarRol(): void {
    this.roles = this.rolesCompletos.filter(rol => {
      let datos = rol.rolNombre.trim().
        concat(rol.rolDescripcion.trim());
      if (datos.toLowerCase().match(this.parametroBuscar.toLowerCase())) {
        return rol;
      }
    })
  }
}