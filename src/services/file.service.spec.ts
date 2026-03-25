import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FileService } from './file-service.service';

/**
 * Deux jeux de tests unitaires (même service, périmètres distincts) — utiles pour oral / dossier CCP.
 * - Jeu 1 : POST multipart (upload)
 * - Jeu 2 : GET JSON (URL image principale + galerie)
 */
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
    httpMock.verify();
  });

  describe('Jeu 1 — upload fichier (HttpClient + FormData)', () => {
    it('devrait uploader un fichier avec succès', async () => {
      const mockFile = new File(['dummy content'], 'example.txt', { type: 'text/plain' });
      const mockResponse = { fileUrl: 'http://localhost:9091/files/example.txt' };
      const gameId = 123;

      const promise = service.uploadFile(mockFile, gameId);

      const req = httpMock.expectOne('http://localhost:9091/game/upload/file');
      expect(req.request.method).toBe('POST');
      expect(req.request.withCredentials).toBe(true);
      expect(req.request.body).toBeInstanceOf(FormData);
      req.flush(mockResponse);

      await expectAsync(promise).toBeResolvedTo(
        jasmine.objectContaining({ fileUrl: 'http://localhost:9091/files/example.txt' })
      );
    });

    it('devrait rejeter avec un message HTTP en cas d’erreur serveur', async () => {
      const mockFile = new File(['x'], 'f.txt', { type: 'text/plain' });
      const promise = service.uploadFile(mockFile, 1);

      const req = httpMock.expectOne('http://localhost:9091/game/upload/file');
      req.flush({}, { status: 500, statusText: 'Internal Server Error' });

      await expectAsync(promise).toBeRejectedWithError(
        'Erreur HTTP: 500 - Internal Server Error'
      );
    });
  });

  describe('Jeu 2 — récupération des URLs d’images (HttpClient GET)', () => {
    it('devrait retourner l’URL d’image principale', async () => {
      const gameId = 42;
      const promise = service.getImageUrl(gameId);

      const req = httpMock.expectOne(`http://localhost:9091/game/image/${gameId}`);
      expect(req.request.method).toBe('GET');
      req.flush({ fileUrl: 'http://localhost:9091/files/game42.jpg' });

      await expectAsync(promise).toBeResolvedTo('http://localhost:9091/files/game42.jpg');
    });

    it('devrait rejeter si l’image est introuvable (404)', async () => {
      const promise = service.getImageUrl(99);

      const req = httpMock.expectOne('http://localhost:9091/game/image/99');
      req.flush({}, { status: 404, statusText: 'Not Found' });

      await expectAsync(promise).toBeRejectedWithError(
        'Erreur lors de la récupération de l\'image'
      );
    });

    it('devrait retourner la liste des images de la galerie', async () => {
      const images = [{ url: 'http://localhost:9091/files/a.jpg' }, { url: 'http://localhost:9091/files/b.jpg' }];
      const promise = service.getImagesUrls(7);

      const req = httpMock.expectOne('http://localhost:9091/game/images/7');
      expect(req.request.method).toBe('GET');
      req.flush({ images });

      await expectAsync(promise).toBeResolvedTo(images);
    });

    it('devrait retourner un tableau vide si le JSON ne contient pas images', async () => {
      const promise = service.getImagesUrls(7);

      const req = httpMock.expectOne('http://localhost:9091/game/images/7');
      req.flush({});

      await expectAsync(promise).toBeResolvedTo([]);
    });
  });
});
