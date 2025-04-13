import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sucursal } from '../model/Sucursal';
import { DatosPagoStripe } from '../model/DatosPagoStripe';
import { URL_API_STRIPE } from '../constantes/constantes';

declare var Stripe: any; // Declara Stripe para evitar errores de TS

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private stripe: any;
  //private card: any;
  private colorTextStripe!: string;

  constructor(private http: HttpClient) {
    // LGDD ini
    this.listenForColorSchemeChange();
    // LGDD ini
  }

  // LGDD ini
  getCssVariableValue(variableName: string): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
  }

  private listenForColorSchemeChange() {
    const darkModeMediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)'
    );

    // Initial check
    this.updateStripeColor();

    // Listen for changes
    darkModeMediaQuery.addEventListener('change', () => {
      this.updateStripeColor();
    });
  }

  private updateStripeColor() {
    const stripeColor = this.getCssVariableValue('--ion-color-stripe');
    this.colorTextStripe = stripeColor;
  }
  // LGDD fin

  initCardElement(sucursal: Sucursal) {
    // Detectar tema oscuro
    let isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let colorTexto = '#888888';
    if (isDarkMode) {
      colorTexto = '#cccccc';
    } else {
      colorTexto = '#333333';
    }

    let llavePublicaSucursal = sucursal.stripePublicKey;
    this.stripe = Stripe(llavePublicaSucursal);
    let elements = this.stripe.elements();
    let style = {
      base: {
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '1.1em',
        color: colorTexto,
        '::placeholder': {
          color: '#888888',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    };

    var cardNumber = elements.create('cardNumber', {
      style: style,
    });
    var cardExpiry = elements.create('cardExpiry', {
      style: style,
    });
    var cardCvc = elements.create('cardCvc', {
      style: style,
    });
    var postalCode = elements.create('postalCode', {
      style: style,
    });

    //this.card = elements.create('card', { style: style });
    //return this.card;

    return {
      cardNumber: cardNumber,
      cardExpiry: cardExpiry,
      cardCvc: cardCvc,
      postalCode: postalCode,
    };
  }

  createToken(tarjeta: any): Promise<any> {
    return this.stripe.createToken(tarjeta);
  }

  procesaPagoStripe(dps: DatosPagoStripe) {
    const apiURL = URL_API_STRIPE + '/stripe/charge';
    return this.http.post(apiURL, dps);
  }
}
