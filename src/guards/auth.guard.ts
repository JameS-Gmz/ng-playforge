import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Guard pour les utilisateurs authentifiés
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.parseUrl('/auth');
};

// Guard pour les développeurs
export const developerGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && (authService.isDeveloper() || authService.isSuperAdmin())) {
    return true;
  }

  // Rediriger vers la page d'accueil si l'utilisateur n'est pas un développeur ou superadmin
  return router.parseUrl('/');
};

// Guard pour les administrateurs
export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && (authService.isAdmin() || authService.isSuperAdmin())) {
    return true;
  }

  return router.parseUrl('/');
};

// Guard pour les super administrateurs
export const superAdminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isSuperAdmin()) {
    return true;
  }

  return router.parseUrl('/');
}; 