import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Role {
  id: number;
  name: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  birthday?: string;
  role?: Role;
  RoleId?: number;
}

/**
 * Service HTTP vers l’API utilisateur (Express, port 9090).
 * Les routes protégées requièrent un en-tête `Authorization: Bearer <token>`.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:9090/user';
  private userSubject = new BehaviorSubject<User | null>(null);

  constructor() {}

  /**
   * Valide la réponse des routes d’assignation de rôle : lecture du corps en texte puis parsing JSON optionnel.
   */
  private async assertAssignResponseOk(response: Response): Promise<void> {
    const text = await response.text();
    let payload: { message?: string; error?: string } = {};
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        /* ignore */
      }
    }
    if (response.ok) {
      return;
    }
    const msg =
      payload.message ||
      payload.error ||
      `Impossible d’assigner le rôle (${response.status} ${response.statusText}).`;
    throw new Error(msg);
  }

  private getHeaders(): Headers {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    return new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${this.apiUrl}/all`, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
      
      const users = await response.json();
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async updateUser(user: User): Promise<User> {
    try {
      const response = await fetch(`${this.apiUrl}/profile/${user.id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({
          username: user.username,
          email: user.email,
          RoleId: user.RoleId
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/${userId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async getUserById(userId: string): Promise<User> {
    try {
      const response = await fetch(`${this.apiUrl}/id/${userId}`, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  setCurrentUser(user: User | null): void {
    this.userSubject.next(user);
  }

  async getUserByUsername(username: string): Promise<User> {
    try {
      const response = await fetch(`${this.apiUrl}/username/${username}`, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching user by username:', error);
      throw error;
    }
  }

  async getRoles(): Promise<Role[]> {
    try {
      const response = await fetch(`http://localhost:9090/role/all`, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch roles: ${response.statusText}`);
      }
      
      const roles = await response.json();
      return roles;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  }

  async assignUserRole(userId: number): Promise<void> {
    const response = await fetch(`${this.apiUrl}/assign-user/${userId}`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    await this.assertAssignResponseOk(response);
  }

  async assignDeveloperRole(userId: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/assign-developer/${userId}`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    await this.assertAssignResponseOk(response);
  }

  async assignAdminRole(userId: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/assign-admin/${userId}`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    await this.assertAssignResponseOk(response);
  }

  async assignSuperAdminRole(userId: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/assign-superadmin/${userId}`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    await this.assertAssignResponseOk(response);
  }

  async getCurrentDeveloperId(): Promise<number> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token non disponible. Veuillez vous connecter.');
    }

    try {
      // Vérification du Content-Type avant parsing JSON (réponse d’erreur non JSON possible).
      const response = await fetch(`${this.apiUrl}/current-developer-id`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');

      if (!response.ok) {
        if (isJson) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.message || `Erreur ${response.status}: ${response.statusText}`);
        } else {
          const text = await response.text();
          console.error(`❌ Réponse non-JSON reçue:`, text.substring(0, 200));
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
      }

      if (!isJson) {
        const text = await response.text();
        console.error(`❌ Réponse non-JSON reçue:`, text.substring(0, 200));
        throw new Error(`Erreur: la réponse n'est pas du JSON (${response.status} ${response.statusText})`);
      }

      const data = await response.json();
      const developerId = data.developerId || data.id || data;
      
      if (!developerId || isNaN(developerId)) {
        throw new Error('ID du développeur invalide dans la réponse');
      }

      return parseInt(developerId);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de l\'ID du développeur:', error);
      throw error;
    }
  }
}

