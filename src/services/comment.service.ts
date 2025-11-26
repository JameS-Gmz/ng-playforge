import { Injectable } from '@angular/core';

export interface Comment {
  id: number;
  content: string | null;
  rating: number | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
    username: string;
    avatar: string | null;
  };
}

export interface CommentResponse {
  comments: Comment[];
  averageRating: number;
  totalComments: number;
  totalRatings: number;
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = 'http://localhost:9090/comment';

  constructor() { }

  // Récupérer tous les commentaires d'un jeu
  async getGameComments(gameId: number): Promise<CommentResponse> {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseUrl}/game/${gameId}`, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.error || errorData.message || `Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      // Convertir les dates string en objets Date
      data.comments = data.comments.map((comment: any) => ({
        ...comment,
        createdAt: new Date(comment.createdAt),
        updatedAt: new Date(comment.updatedAt),
      }));
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
      throw error;
    }
  }

  // Créer un nouveau commentaire
  async createComment(gameId: number, content: string, rating: number | null): Promise<Comment> {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token non disponible. Veuillez vous connecter.');
      }

      const response = await fetch(`${this.baseUrl}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          GameId: gameId,
          content: content || null,
          rating: rating || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.error || errorData.message || `Erreur ${response.status}: ${response.statusText}`);
      }

      const comment = await response.json();
      return {
        ...comment,
        createdAt: new Date(comment.createdAt),
        updatedAt: new Date(comment.updatedAt),
      };
    } catch (error) {
      console.error('Erreur lors de la création du commentaire:', error);
      throw error;
    }
  }

  // Mettre à jour un commentaire
  async updateComment(commentId: number, content: string, rating: number | null): Promise<Comment> {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token non disponible. Veuillez vous connecter.');
      }

      const response = await fetch(`${this.baseUrl}/update/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: content || null,
          rating: rating || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.error || errorData.message || `Erreur ${response.status}: ${response.statusText}`);
      }

      const comment = await response.json();
      return {
        ...comment,
        createdAt: new Date(comment.createdAt),
        updatedAt: new Date(comment.updatedAt),
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du commentaire:', error);
      throw error;
    }
  }

  // Supprimer un commentaire
  async deleteComment(commentId: number): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token non disponible. Veuillez vous connecter.');
      }

      const response = await fetch(`${this.baseUrl}/delete/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.error || errorData.message || `Erreur ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire:', error);
      throw error;
    }
  }
}

