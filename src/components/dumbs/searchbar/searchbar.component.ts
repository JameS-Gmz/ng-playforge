import { Component, EventEmitter, Output, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { GameService } from '../../../services/game.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FileService } from '../../../services/file-service.service';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css'
})
export class SearchbarComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  games: any[] = [];
  errorMessage: string = '';
  imageUrl: string | undefined;
  isLoading: boolean = false;
  showResults: boolean = false;
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  
  @Output() searchResults = new EventEmitter<any[]>();

  constructor(
    private gameService: GameService, 
    private fileService: FileService,
    private elementRef: ElementRef
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeResults();
    }
  }

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.performSearch(query);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onInput() {
    this.showResults = true;
    this.searchSubject.next(this.searchQuery.trim());
  }

  public closeResults() {
    this.showResults = false;
  }

  private async performSearch(query: string) {
    if (!query) {
      this.games = [];
      this.errorMessage = '';
      this.searchResults.emit([]);
      return;
    }

    this.isLoading = true;
    try {
      const result = await this.gameService.searchGames(query);
      this.games = await Promise.all(result.map(async (game: any) => {
        let imageUrl;
        try {
          imageUrl = await this.fileService.getImageUrl(game.id);
        } catch (error) {
          console.error('Erreur lors de la récupération de l\'image:', error);
          imageUrl = 'assets/images/default-game.jpg';
        }
  
        return {
          title: game.title,
          price: game.price,
          id: game.id,
          imageUrl: imageUrl,
          description: game.description
        };
      }));
      this.errorMessage = this.games.length === 0 ? 'Aucun jeu correspondant' : '';
      this.searchResults.emit(this.games);
    } catch (error) {
      this.errorMessage = 'Erreur lors de la recherche';
      this.games = [];
      this.searchResults.emit([]);
    } finally {
      this.isLoading = false;
    }
  }

  reset() {
    this.searchQuery = '';
    this.games = [];
    this.errorMessage = '';
    this.searchResults.emit([]);
    this.closeResults();
  }
}
