import { Routes } from '@angular/router';
import { HomeComponent } from '../components/dumbs/home/home.component';
import { GameComponent } from '../components/smarts/game/game.component';
import { AllGamesComponent } from '../components/dumbs/all-games/all-games.component';
import { LibraryComponent } from '../components/dumbs/library/library.component';
import { ProfileComponent } from '../components/dumbs/profile/profile.component';
import { GameDetailsComponent } from '../components/dumbs/game-details/game-details.component';

export const routes: Routes = [
    {path: "", component:HomeComponent},
    {path: "game", component:GameComponent},
    {path: "all-game", component:AllGamesComponent},
    {path: "library", component:LibraryComponent},
    {path: "profile", component:ProfileComponent},
    {path: "game/id/:id", component:GameDetailsComponent}


];
