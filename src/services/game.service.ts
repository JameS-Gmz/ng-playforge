import { Injectable, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class GameService implements OnInit {

  ngOnInit(): void {
    const headers: Headers = new Headers()
    headers.append("Content-Type", "application/json")

    fetch("http://localhost/9090/game",
      {
                headers: headers,
      }
    )
  }
}


