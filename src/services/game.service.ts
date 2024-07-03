import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService implements OnInit {

  ngOnInit(): void {
    const headers: Headers = new Headers()
    headers.append("Content-Type", "application/json")

    fetch("http://localhost/9090/game",
      {
        method : "POST",
        headers: headers,
      }
    )
  }
}


