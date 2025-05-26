import { Routes } from '@angular/router';
import { HomeComponent } from '../components/dumbs/home/home.component';
import { GameComponent } from '../components/smarts/game/game.component';
import { AllGamesComponent } from '../components/dumbs/all-games/all-games.component';
import { LibraryComponent } from '../components/dumbs/library/library.component';
import { ProfileComponent } from '../components/dumbs/profile/profile.component';
import { GameDetailsComponent } from '../components/smarts/game-details/game-details.component';
import { AuthComponent } from '../components/dumbs/auth/auth.component';
import { EditProfileComponent } from '../components/smarts/editprofile/editprofile.component';
import { AdminComponent } from '../components/smarts/admin/admin.component';
import { DeveloperComponent } from '../components/smarts/developer/developer.component';
import { authGuard, developerGuard, adminGuard, superAdminGuard } from '../guards/auth.guard';

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "game", component: GameComponent, canActivate: [developerGuard] },
    { path: "all-games", component: AllGamesComponent },
    { path: "library", component: LibraryComponent, canActivate: [authGuard] },
    { path: "profile", component: ProfileComponent, canActivate: [authGuard] },
    { path: "game/id/:id", component: GameDetailsComponent },
    { path: "auth", component: AuthComponent },
    { path: "editprofile", component: EditProfileComponent, canActivate: [authGuard] },
    { path: "admin", component: AdminComponent, canActivate: [adminGuard] },
    { path: "developer", component: DeveloperComponent, canActivate: [developerGuard] },
];
