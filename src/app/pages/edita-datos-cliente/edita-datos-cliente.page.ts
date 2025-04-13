import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonButton,
} from '@ionic/angular/standalone';
import { ClienteService } from 'src/app/services/cliente.service';
import { PuntoVenta } from 'src/app/model/PuntoVenta';

// Validador para verificar que las contraseñas coincidan
function passwordMatchValidator(
  form: AbstractControl
): ValidationErrors | null {
  const password = form.get('contrasenia')?.value;
  const confirmPassword = form.get('confirmarContrasenia')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-edita-datos-cliente',
  templateUrl: './edita-datos-cliente.page.html',
  styleUrls: ['./edita-datos-cliente.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonLabel,
    IonItem,
    IonCol,
    IonRow,
    IonGrid,
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
  ],
})
export class EditaDatosClientePage implements OnInit {
  clienteForm: FormGroup;
  puntoVenta: PuntoVenta;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private navCtrl: NavController
  ) {
    // Inicializamos el formulario con los datos actuales del cliente
    this.puntoVenta = PuntoVenta.getInstance();
    let cliente = this.puntoVenta.cliente;
    console.log('Datos del cliente:', cliente);
    // Se inicializa el formulario con los datos actuales y se agrega el campo para confirmar la contraseña
    this.clienteForm = this.fb.group(
      {
        idCliente: [cliente.idCliente],
        nombre: [cliente.nombre, Validators.required],
        contrasenia: [cliente.contrasenia, Validators.required],
        confirmarContrasenia: [cliente.contrasenia, Validators.required],
        telefono: [cliente.telefono, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      },
      { validators: passwordMatchValidator }
    );
  }

  ngOnInit() {
    console.log('Edición de datos del cliente');
  }

  // Envía el formulario si es válido
  onSubmit() {
    if (this.clienteForm.valid) {
      // Se excluye el campo de confirmación antes de enviar los datos
      const { confirmarContrasenia, ...clienteActualizado } =
        this.clienteForm.value;
      this.clienteService.actualizarCliente(clienteActualizado).subscribe({
        next: (respuesta) => {
          console.log(respuesta);
          this.navCtrl.navigateRoot('/home');
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }
}
