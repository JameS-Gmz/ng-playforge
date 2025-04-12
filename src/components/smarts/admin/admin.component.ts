import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  standalone: true,
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  selectedUser: any = null;
  userSearchTerm: string = '';
  userErrorMessage: string | null = null;
  isUserLoading: boolean = false;
  isSuperAdmin: boolean = false;
  roles: any[] = [];

  games: any[] = [];
  filteredGames: any[] = [];
  selectedGame: any = null;
  gameSearchTerm: string = '';
  gameErrorMessage: string | null = null;
  isGameLoading: boolean = false;
  statuses: any[] = [];

  showUsers: boolean = true;
  showGames: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private gameService: GameService
  ) {}

  async ngOnInit() {
    if (!this.authService.isAdmin() && !this.authService.isSuperAdmin()) {
      this.router.navigate(['/']);
      return;
    }
    this.isSuperAdmin = this.authService.isSuperAdmin();
    await this.loadUsers();
    await this.loadRoles();
    await this.loadGames();
    await this.loadStatuses();
  }

  toggleView(view: 'users' | 'games') {
    if (view === 'users') {
      this.showUsers = true;
      this.showGames = false;
    } else {
      this.showUsers = false;
      this.showGames = true;
    }
  }

  private async loadUsers() {
    this.isUserLoading = true;
    try {
      const response = await this.userService.getAllUsers();
      this.users = response || [];
      this.filteredUsers = [...this.users];
      this.userErrorMessage = null;
    } catch (error) {
      console.error('Error loading users:', error);
      this.userErrorMessage = 'Error loading users';
    } finally {
      this.isUserLoading = false;
    }
  }

  private async loadRoles() {
    try {
      console.log('Loading roles...');
      const response = await this.userService.getRoles();
      console.log('Roles response:', JSON.stringify(response, null, 2));
      this.roles = response || [];
      console.log('Roles after assignment:', JSON.stringify(this.roles, null, 2));
      
      if (!this.isSuperAdmin) {
        this.roles = this.roles.filter(role => role.name !== 'superadmin');
      }
      console.log('Final roles:', JSON.stringify(this.roles, null, 2));
    } catch (error) {
      console.error('Error loading roles:', error);
      this.userErrorMessage = 'Error loading roles: ' + (error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async loadGames() {
    this.isGameLoading = true;
    try {
      const response = await this.gameService.getAllGames();
      this.games = response || [];
      this.filteredGames = [...this.games];
      console.log('Games data structure:', JSON.stringify(this.games[0], null, 2));
      this.gameErrorMessage = null;
    } catch (error) {
      console.error('Error loading games:', error);
      this.gameErrorMessage = 'Error loading games';
    } finally {
      this.isGameLoading = false;
    }
  }

  private async loadStatuses() {
    try {
      const response = await this.gameService.getStatuses();
      this.statuses = response || [];
      console.log('Statuses data:', this.statuses);
    } catch (error) {
      console.error('Error loading statuses:', error);
    }
  }

  filterUsers() {
    if (!this.userSearchTerm.trim()) {
      this.filteredUsers = [...this.users];
      return;
    }
    
    const searchLower = this.userSearchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user => 
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.role?.name || '').toLowerCase().includes(searchLower)
    );
  }

  filterGames() {
    if (!this.gameSearchTerm.trim()) {
      this.filteredGames = [...this.games];
      return;
    }
    
    const searchLower = this.gameSearchTerm.toLowerCase();
    this.filteredGames = this.games.filter(game => 
      game.title.toLowerCase().includes(searchLower) ||
      game.description.toLowerCase().includes(searchLower) ||
      (game.status?.name || '').toLowerCase().includes(searchLower)
    );
  }

  async deleteUser(userId: string) {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    this.isUserLoading = true;
    try {
      await this.userService.deleteUser(userId);
      await this.loadUsers();
      this.userErrorMessage = null;
    } catch (error) {
      console.error('Error deleting user:', error);
      this.userErrorMessage = 'Error deleting user';
    } finally {
      this.isUserLoading = false;
    }
  }

  async deleteGame(gameId: string) {
    if (!confirm('Are you sure you want to delete this game?')) {
      return;
    }

    this.isGameLoading = true;
    try {
      await this.gameService.deleteGame(gameId);
      await this.loadGames();
      this.gameErrorMessage = null;
    } catch (error) {
      console.error('Error deleting game:', error);
      this.gameErrorMessage = 'Error deleting game';
    } finally {
      this.isGameLoading = false;
    }
  }

  editUser(user: any) {
    console.log('Editing user:', user);
    console.log('User role:', user.role);
    console.log('User RoleId:', user.RoleId);
    
    this.selectedUser = { 
      ...user,
      RoleId: user.role?.id || user.RoleId
    };
    
    console.log('Selected user after edit:', this.selectedUser);
  }

  editGame(game: any) {
    this.selectedGame = { ...game };
  }

  async updateUser() {
    if (!this.selectedUser) return;

    this.isUserLoading = true;
    try {
      console.log('Selected User:', JSON.stringify(this.selectedUser, null, 2));
      console.log('Selected User RoleId:', this.selectedUser.RoleId);
      console.log('Available Roles:', JSON.stringify(this.roles, null, 2));
      
      // Convertir RoleId en nombre pour la comparaison
      const roleId = Number(this.selectedUser.RoleId);
      console.log('Converted RoleId:', roleId);
      
      // Trouver le rôle sélectionné par son ID
      const selectedRole = this.roles.find(role => role.id === roleId);
      
      console.log('Selected Role:', selectedRole);
      
      if (!selectedRole) {
        this.userErrorMessage = 'Rôle invalide - Veuillez sélectionner un rôle valide';
        return;
      }

      // Assigner le rôle en fonction du type de rôle
      switch (selectedRole.name.toLowerCase()) {
        case 'user':
          console.log('Assigning user role...');
          await this.userService.assignUserRole(Number(this.selectedUser.id));
          break;
        case 'developer':
          console.log('Assigning developer role...');
          await this.userService.assignDeveloperRole(this.selectedUser.id);
          break;
        case 'admin':
          console.log('Assigning admin role...');
          await this.userService.assignAdminRole(this.selectedUser.id);
          break;
        case 'superadmin':
          if (!this.isSuperAdmin) {
            this.userErrorMessage = 'Vous n\'avez pas les droits pour assigner le rôle superadmin';
            return;
          }
          console.log('Assigning superadmin role...');
          await this.userService.assignSuperAdminRole(this.selectedUser.id);
          break;
        default:
          console.log('Role name not matched:', selectedRole.name);
          this.userErrorMessage = 'Rôle non supporté: ' + selectedRole.name;
          return;
      }
      
      // Mettre à jour les autres informations de l'utilisateur
      await this.userService.updateUser({
        id: this.selectedUser.id,
        username: this.selectedUser.username,
        email: this.selectedUser.email
      });

      this.selectedUser = null;
      await this.loadUsers();
      this.userErrorMessage = null;
    } catch (error: unknown) {
      console.error('Error updating user:', error);
      this.userErrorMessage = 'Error updating user: ' + (error instanceof Error ? error.message : 'Unknown error');
    } finally {
      this.isUserLoading = false;
    }
  }

  async updateGame() {
    if (!this.selectedGame) return;

    this.isGameLoading = true;
    try {
      // Convertir le prix en nombre
      const gameData = {
        ...this.selectedGame,
        price: Number(this.selectedGame.price)
      };

      await this.gameService.updateGame(this.selectedGame.id, gameData);
      this.selectedGame = null;
      await this.loadGames();
      this.gameErrorMessage = null;
    } catch (error) {
      console.error('Error updating game:', error);
      this.gameErrorMessage = 'Error updating game';
    } finally {
      this.isGameLoading = false;
    }
  }

  cancelUserEdit() {
    this.selectedUser = null;
    this.userErrorMessage = null;
  }

  cancelGameEdit() {
    this.selectedGame = null;
    this.gameErrorMessage = null;
  }

  getStatusName(statusId: number): string {
    const status = this.statuses.find(s => s.id === statusId);
    return status ? status.name : '';
  }
}
