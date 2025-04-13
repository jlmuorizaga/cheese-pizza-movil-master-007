import { Especialidad } from './Especialidad';
import { Ingrediente } from './Ingrediente';
import { Orilla } from './Orilla';
import { Seccion } from './Seccion';

export class SeccionPizzas extends Seccion {
  especialidades!: Especialidad[];
  ingredientes!: Ingrediente[];
  orillas!: Orilla[];
}
