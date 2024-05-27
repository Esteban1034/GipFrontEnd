import { UsuarioRoles } from "./usuario-rol";



export class Usuario {
    idUsuario:number;
    nombre:string;
    apellido:string;
    password:string;
    username:string;
    correo:string;
    enabled:boolean=true;
    usuarioRoles:UsuarioRoles[];
    authorities:[];
    numeroDocumento:string;
}
