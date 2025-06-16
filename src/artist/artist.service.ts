import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateArtistDto } from './dto/createArtist.dto';
import { UpdateArtistDto } from './dto/updateArtist.dto';

@Injectable()
export class ArtistService {
  constructor(private databaseService: DatabaseService) {}

  async getAllArtists() {
    return this.databaseService.getArtists();
  }

  async getArtistById(id: string) {
    const artist = await this.databaseService.getArtistById(id);
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }

    return artist;
  }

  async createArtist(createArtistData: CreateArtistDto) {
    return this.databaseService.createArtist(createArtistData);
  }

  async updateArtist(id: string, updateArtistData: UpdateArtistDto) {
    if (!updateArtistData.name && !updateArtistData.grammy) {
      throw new BadRequestException('No fields to update');
    }

    const artist = await this.databaseService.updateArtist(
      id,
      updateArtistData,
    );
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }

    return artist;
  }

  async deleteArtist(id: string) {
    const artist = await this.databaseService.deleteArtist(id);
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
  }
}
