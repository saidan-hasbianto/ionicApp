import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  authstatus:any;

  constructor(
    private loginSvc: LoginService
  ) {}

  canActivate(): boolean {
    this.loginSvc.authenticationState.subscribe((data) => {
      this.authstatus=data;
    });
    return this.authstatus;
  }
  
}
