import { SubItem } from "./sub_item"

export class Item{
    id:number
    isTitle:boolean
    label:string
    link:string
    subItems: SubItem[];
    seleccionado:boolean;
}