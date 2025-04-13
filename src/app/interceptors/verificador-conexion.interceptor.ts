import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const verificadorConexionInterceptor: HttpInterceptorFn = (
  req,
  next
) => {
  console.log('Entrando al interceptor');
  const alertController = inject(AlertController);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        alertController
          .create({
            header: 'Error de Conexi\u00f3n',
            message: 'Verifica tu conexi\u00f3n y vuelve a intentarlo.',
            buttons: ['Aceptar'],
          })
          .then((alert) => alert.present());
      }
      return throwError(() => error);
    })
  );
};
