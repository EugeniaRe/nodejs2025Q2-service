import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Album } from './album.interface';
import { CreateAlbumDto } from './dto/createAlbum.dto';
import { UpdateAlbumDto } from './dto/updateAlbum.dto';

@Injectable()
export class AlbumService {
  constructor(private databaseService: DatabaseService) {}

  getAllAlbums(): Album[] {
    return this.databaseService.getAllAlbums();
  }

  getAlbumById(id: string): Album | undefined {
    const album = this.databaseService.getAlbumById(id);
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }

    return album;
  }

  createAlbum(createAlbumData: CreateAlbumDto): Album {
    return this.databaseService.createAlbum(createAlbumData);
  }

  updateAlbum(id: string, updateAlbumData: UpdateAlbumDto): Album {
    const album = this.databaseService.updateAlbum(id, updateAlbumData);
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }

    return album;
  }

  deleteAlbum(id: string): void {
    const album = this.databaseService.deleteAlbum(id);
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
  }
}
