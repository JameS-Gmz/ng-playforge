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

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:9090/user';
  private userSubject = new BehaviorSubject<User | null>(null);

  constructor() {}

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
      console.log('Users fetched:', users);
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
      
      return response.json();
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  }
}

