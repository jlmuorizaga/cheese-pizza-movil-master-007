import { IonButton } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-boton-menu',
  templateUrl: './boton-menu.component.html',
  styleUrls: ['./boton-menu.component.css'],
  standalone: true,
  imports: [IonButton],
})
export class BotonMenuComponent implements OnInit {
  constructor(private navCtrl: NavController) {}

  ngOnInit() {
    console.log('Componente botón menú');
  }

  abreMenu() {
    console.log('Abriendo el menú...');
    this.navCtrl.navigateBack('/menu-principal');
  }
}
