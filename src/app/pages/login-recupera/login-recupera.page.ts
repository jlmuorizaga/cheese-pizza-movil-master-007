import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
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
  IonButton,
  IonInput,
  IonLabel, IonItem } from '@ionic/angular/standalone';

import { NavController, AlertController } from '@ionic/angular';
import { ClienteService } from 'src/app/services/cliente.service';
import { CorreoService } from 'src/app/services/correo.service';
import { DatosCorreo } from 'src/app/model/DatosCorreo';

@Component({
  selector: 'app-login-recupera',
  templateUrl: './login-recupera.page.html',
  styleUrls: ['./login-recupera.page.scss'],
  standalone: true,
  imports: [IonItem,
    IonLabel,
    IonButton,
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
    IonInput,
  ],
})
export class LoginRecuperaPage implements OnInit {
  formularioRecuperaLogin: FormGroup;

  constructor(
    public fb: FormBuilder,
    public alertController: AlertController,
    private clienteSvc: ClienteService,
    private correoSvc: CorreoService,
    private navCrtl: NavController
  ) {
    this.formularioRecuperaLogin = this.fb.group({
      correoElectronico: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    console.log('Página recuperación de contraseña');
  }

  realizaRecuperacion() {
    console.log('Recuperando contraseña');
    if (this.formularioRecuperaLogin.valid) {
      console.log(
        'Correo:',
        this.formularioRecuperaLogin.value.correoElectronico
      );
      //Recupera el correo
      //Primero verifica que el correo ya esté registrado
      let correo = this.formularioRecuperaLogin.value.correoElectronico;

      this.clienteSvc.leeExisteCorreo(correo).subscribe({
        next: (res: any) => {
          if (res.existe != '0') {
            console.log('El correo existe...');
            //Enviando correo electrónico de recuperación de contraseña
            let datosCorreo = new DatosCorreo();
            datosCorreo.correo = correo;
            datosCorreo.asunto =
              'Recuperaci\u00f3n de contrase\u00f1a de Chesse Pizza M\u00f3vil';

            this.correoSvc.recuperaContrasenia(datosCorreo).subscribe({
              next: (res: any) => {
                this.mensajeCorreo('Correo enviado', res.respuesta);
                //Regresa a la página de login
                this.navCrtl.navigateBack('/login');
              },
              error: (error: any) => {
                // LGDD ini
                this.mensajeErrorConexion();
                // LGDD fin
                console.log(
                  'Ocurrió un error al enviar el correo de recuperación:'
                );
                console.log(error);
              },
            });
          } else {
            console.log('El correo no existe...');
            this.mensajeCorreo(
              'Correo no registrado',
              'El correo no est\u00e1 registrado en nuestra aplicaci\u00f3n, verifica que lo hayas escrito correctamente. Si est\u00e1 correctamente escrito, por favor considera registrarte en la aplicaci\u00f3n.'
            );
          }
        },
        error: (error: any) => {
          // LGDD ini
          this.mensajeErrorConexion();
          // LGDD fin
          console.log('Error al leer el servicio existe correo:');
          console.log(error);
        },
      });
    }
  }

  async mensajeCorreo(encabezado: string, texto: string) {
    const alert = await this.alertController.create({
      header: encabezado,
      message: texto,
      buttons: ['Aceptar'],
    });
    alert.backdropDismiss = false;
    await alert.present();
  }

  async mensajeErrorConexion() {
    const alert = await this.alertController.create({
      header: 'Error de conexi\u00f3n',
      message:
        'No pudimos conectarnos a los servidores de Cheese Pizza, ' +
        'por favor revisa tu conexi\u00f3n a Internet e intenta de nuevo.',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            // Aquí defines lo que quieres que haga tu función al presionar OK
            //this.realizaRecuperacion();
          },
        },
      ],
    });
    alert.backdropDismiss = false;
    await alert.present();
  }
}
