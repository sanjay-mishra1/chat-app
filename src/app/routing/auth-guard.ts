import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../chat-services/auth/auth.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(route, state: RouterStateSnapshot) {
    return this.auth.user.pipe(
      map((user) => {
        if (user) return true;
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      })
    );
  }
}
