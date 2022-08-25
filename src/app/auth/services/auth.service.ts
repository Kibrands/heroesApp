import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, tap } from 'rxjs';

import { environment } from 'src/environments/environment';

import { Auth } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;
  private _auth: Auth | undefined;

  get auth(): Auth  {
    return { ...this._auth! };
  }

  constructor(private http: HttpClient) { }

  verificarAutenticacion(): Observable<boolean> {
    if (!localStorage.getItem('token')) {
      return of(false);
    }
    return this.http.get<Auth>(this.apiUrl + '/usuarios/' + localStorage.getItem('token'))
      .pipe(
        map(auth => {
          this._auth = auth;
          return true;
        })
      )
  }

  login(): Observable<Auth> {
    return this.http.get<Auth>(this.apiUrl + '/usuarios/1')
      .pipe(
        tap(auth => this._auth = auth),
        tap(auth => localStorage.setItem('token',auth.id))
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this._auth = undefined;
  }
}
