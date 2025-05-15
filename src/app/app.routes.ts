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


export const routes: Routes = [
    {path: "", component:HomeComponent},
    {path: "game", component:GameComponent},
    {path: "all-games", component:AllGamesComponent},
    {path: "library", component:LibraryComponent},
    {path: "profile", component:ProfileComponent},
    {path: "game/id/:id", component:GameDetailsComponent},
    {path:"auth",component:AuthComponent},
    {path: "editprofile", component:EditProfileComponent},
    {path: "admin", component:AdminComponent},
    {path: "developer", component:DeveloperComponent},
]
