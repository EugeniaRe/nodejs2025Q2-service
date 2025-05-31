import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FavoritesService {
  constructor(private databaseService: DatabaseService) {}

  getAllFavorites() {
    return this.databaseService.getAllFavorites();
  }

  addTrackToFavorites(id: string) {
    try {
      this.databaseService.addFavoriteTrack(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException(`Track with id ${id} not found`);
      }
      throw error;
    }
  }

  deleteTrackFromFavorites(id: string) {
    try {
      this.databaseService.deleteFavoriteTrack(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          `Track with id ${id} not found in favorites`,
        );
      }
      throw error;
    }
  }

  addAlbumToFavorites(id: string) {
    try {
      this.databaseService.addFavoriteAlbum(id);
      return {
        message: `Album with id ${id} added to favorites`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException(`Album with id ${id} not found`);
      }
      throw error;
    }
  }

  deleteAlbumFromFavorites(id: string) {
    try {
      this.databaseService.deleteFavoriteAlbum(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          `Album with id ${id} not found in favorites`,
        );
      }
      throw error;
    }
  }

  addArtistToFavorites(id: string) {
    try {
      this.databaseService.addFavoriteArtist(id);
      return {
        message: `Artist with id ${id} added to favorites`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException(
          `Artist with id ${id} not found`,
        );
      }
      throw error;
    }
  }

  deleteArtistFromFavorites(id: string) {
    try {
      this.databaseService.deleteFavoriteArtist(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          `Artist with id ${id} not found in favorites`,
        );
      }
      throw error;
    }
  }
}
