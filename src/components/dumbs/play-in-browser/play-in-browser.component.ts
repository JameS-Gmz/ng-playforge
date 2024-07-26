import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-play-in-browser',
  standalone: true,
  imports: [],
  templateUrl: './play-in-browser.component.html',
  styleUrl: './play-in-browser.component.css'
})
export class PlayInBrowserComponent {
  @Input() url: string = 'https://mediumslateblue-cod-630349.hostingersite.com/';
  urlSafe: SafeResourceUrl | undefined;
  @Input() titleGame = "";

  constructor(public sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }
  
}
