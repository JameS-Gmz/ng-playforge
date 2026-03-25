import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { GameService } from './game.service';

describe('GameService', () => {
  let service: GameService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(GameService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('devrait retourner une liste de jeux quand getAllGames reçoit un 200 JSON', async () => {
    const games = [{ id: 1, title: 'Test' }];
    const promise = service.getAllGames();

    const req = httpMock.expectOne('http://localhost:9090/game/AllGames');
    expect(req.request.method).toBe('GET');
    req.flush(games);

    await expectAsync(promise).toBeResolvedTo(games);
  });

  it('devrait rejeter avec un message clair si getAllGames reçoit une erreur HTTP', async () => {
    const promise = service.getAllGames();

    const req = httpMock.expectOne('http://localhost:9090/game/AllGames');
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });

    await expectAsync(promise).toBeRejectedWithError(
      'Erreur lors de la récupération des jeux'
    );
  });
});
