
import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchbarComponent } from "../searchbar/searchbar.component";
import { NavItemComponent } from "../../smarts/nav-item/nav-item.component";
import { RouterModule } from '@angular/router';
import { MobileMenuComponent } from "../mobile-menu/mobile-menu.component";
import { CategoryComponent } from "../../smarts/category/category.component";




@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    imports: [SearchbarComponent, NavItemComponent, RouterModule, MobileMenuComponent, CategoryComponent]
})
export class HeaderComponent implements OnInit{
 
    isLoggedIn : boolean = false;
 
    ngOnInit(): void {
     this.checkLoginStatus();
 }

 checkLoginStatus(){
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
 }
 
}
