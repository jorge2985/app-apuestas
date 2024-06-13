export interface Apuesta {
    id: number,
    nombre: string,
    strLeague: string,
    strEvent: string,
    idEvent: string,
    strSport: string,
    strTimestamp: Date,
    strAwayTeam: string,
    strHomeTeam: string,
    importe: number,
    equipoSeleccionado: string,
}