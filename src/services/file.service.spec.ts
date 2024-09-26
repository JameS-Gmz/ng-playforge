import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FileService } from './file-service.service';

describe('FileService', () => {
  let service: FileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FileService]
    });
    service = TestBed.inject(FileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();  // Vérifie qu'il n'y a pas de requêtes non exécutées
  });

  it('devrait uploader un fichier avec succès', async () => {
    const mockFile = new File(['dummy content'], 'example.txt', { type: 'text/plain' });
    const mockResponse = { fileUrl: 'http://localhost:9091/files/example.txt' };
    const gameId = 123;

    service.uploadFile(mockFile, gameId).then((response) => {
      expect(response.fileUrl).toBe('http://localhost:9091/files/example.txt');
    });

    const req = httpMock.expectOne('http://localhost:9091/game/upload/file');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);  // Simule la réponse de l'API
  });

  it('devrait retourner une URL d\'image correctement', async () => {
    const gameId = 123;
    const mockResponse = { fileUrl: 'http://localhost:9091/files/game123.jpg' };

    service.getImageUrl(gameId).then((fileUrl) => {
      expect(fileUrl).toBe('http://localhost:9091/files/game123.jpg');
    });

    const req = httpMock.expectOne(`http://localhost:9091/game/image/${gameId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);  // Simule la réponse de l'API
  });

  it('devrait gérer les erreurs lors de l\'upload de fichier', async () => {
    const mockFile = new File(['dummy content'], 'example.txt', { type: 'text/plain' });
    const gameId = 123;

    service.uploadFile(mockFile, gameId).catch((error) => {
      expect(error.message).toContain('Erreur HTTP');
    });

    const req = httpMock.expectOne('http://localhost:9091/game/upload/file');
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });  // Simule une erreur
  });

  it('devrait gérer les erreurs lors de la récupération de l\'URL de l\'image', async () => {
    const gameId = 123;

    service.getImageUrl(gameId).catch((error) => {
      expect(error.message).toBe('Erreur lors de la récupération de l\'image');
    });

    const req = httpMock.expectOne(`http://localhost:9091/game/image/${gameId}`);
    req.flush({}, { status: 404, statusText: 'Not Found' });  // Simule une erreur 404
  });
});
