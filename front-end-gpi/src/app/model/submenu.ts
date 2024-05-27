import { Item } from "./item";
export class Submenu {
    id:number;
    label:string;
    icon:string;
    items:Item[];
    submenuRoles:[];


    seleccionado:boolean;
}
