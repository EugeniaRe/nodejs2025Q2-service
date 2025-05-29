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

  getAllArtists() {
    return this.databaseService.getArtists();
  }

  getArtistById(id: string) {
    const artist = this.databaseService.getArtistById(id);
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }

    return artist;
  }

  createArtist(createArtistData: CreateArtistDto) {
    return this.databaseService.createArtist(createArtistData);
  }

  updateArtist(id: string, updateArtistData: UpdateArtistDto) {
    if (!updateArtistData.name && !updateArtistData.grammy) {
      throw new BadRequestException('No fields to update');
    }

    const artist = this.databaseService.updateArtist(id, updateArtistData);
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }

    return artist;
  }

  deleteArtist(id: string) {
    const artist = this.databaseService.deleteArtist(id);
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
  }
}
