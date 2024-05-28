import { Actividad } from "../models/actividades.model";

export class Lista {
    id: number;
    titulo: string;
    descripcion: string;
    fechaCreacion: Date;
    progreso: Date;
    terminada: boolean;
    item: Actividad[];

    constructor(titulo: string, descripcion: string) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.fechaCreacion = new Date();
        this.terminada = false;
        this.progreso = new Date();
        this.item = [];
        this.id = new Date().getTime();
    }
}