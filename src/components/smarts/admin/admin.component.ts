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
      console.log('Users data structure:', JSON.stringify(this.users[0], null, 2));
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
      const response = await this.userService.getRoles();
      this.roles = response || [];
      console.log('Roles data:', this.roles);
      if (!this.isSuperAdmin) {
        this.roles = this.roles.filter(role => role.name !== 'superadmin');
      }
    } catch (error) {
      console.error('Error loading roles:', error);
    }
  }

  private async loadGames() {
    this.isGameLoading = true;
    try {
      const response = await this.gameService.getAllGames();
      this.games = response || [];
      this.filteredGames = [...this.games];
      console.log('Games data:', this.games);
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
    this.selectedUser = { ...user };
  }

  editGame(game: any) {
    this.selectedGame = { ...game };
  }

  async updateUser() {
    if (!this.selectedUser) return;

    this.isUserLoading = true;
    try {
      await this.userService.updateUser(this.selectedUser);
      this.selectedUser = null;
      await this.loadUsers();
      this.userErrorMessage = null;
    } catch (error) {
      console.error('Error updating user:', error);
      this.userErrorMessage = 'Error updating user';
    } finally {
      this.isUserLoading = false;
    }
  }

  async updateGame() {
    if (!this.selectedGame) return;

    this.isGameLoading = true;
    try {
      await this.gameService.updateGame(this.selectedGame, this.selectedGame.id);
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
}
