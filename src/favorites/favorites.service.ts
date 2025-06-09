import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FavoritesService {
  constructor(private databaseService: DatabaseService) {}

  async getAllFavorites() {
    return this.databaseService.getAllFavorites();
  }

  async addTrackToFavorites(id: string) {
    try {
      await this.databaseService.addFavoriteTrack(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException(`Track with id ${id} not found`);
      }
      throw error;
    }
  }

  async deleteTrackFromFavorites(id: string) {
    try {
      await this.databaseService.deleteFavoriteTrack(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          `Track with id ${id} not found in favorites`,
        );
      }
      throw error;
    }
  }

  async addAlbumToFavorites(id: string) {
    try {
      await this.databaseService.addFavoriteAlbum(id);
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

  async deleteAlbumFromFavorites(id: string) {
    try {
      await this.databaseService.deleteFavoriteAlbum(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          `Album with id ${id} not found in favorites`,
        );
      }
      throw error;
    }
  }

  async addArtistToFavorites(id: string) {
    try {
      await this.databaseService.addFavoriteArtist(id);
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

  async deleteArtistFromFavorites(id: string) {
    try {
      await this.databaseService.deleteFavoriteArtist(id);
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
