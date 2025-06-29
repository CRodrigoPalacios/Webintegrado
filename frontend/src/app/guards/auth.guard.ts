import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private tokenStorageService: TokenStorageService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const url: string = state.url;
    const expectedRoles = next.data['roles'] as Array<string>;
    return this.checkLogin(url, expectedRoles);
  }

  checkLogin(url: string, expectedRoles?: string[]): true | UrlTree {
    const token = this.tokenStorageService.getToken();
    if (!token) {
      return this.router.parseUrl('/login');
    }

    if (expectedRoles && expectedRoles.length > 0) {
      const user = this.tokenStorageService.getUser();
      if (!user || !user.roles) {
        return this.router.parseUrl('/login');
      }
      // Normalize roles by removing 'ROLE_' prefix if present
      const normalizedUserRoles = user.roles.map((role: string) => role.startsWith('ROLE_') ? role.substring(5) : role);
      const hasRole = normalizedUserRoles.some((role: string) => expectedRoles.includes(role));
      if (!hasRole) {
        // Redirect unauthorized users to home or another page
        return this.router.parseUrl('/home');
      }
    }

    return true;
  }
}
