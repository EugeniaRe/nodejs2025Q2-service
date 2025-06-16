import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
// import { Album } from './album.interface';
import { CreateAlbumDto } from './dto/createAlbum.dto';
import { UpdateAlbumDto } from './dto/updateAlbum.dto';

@Injectable()
export class AlbumService {
  constructor(private databaseService: DatabaseService) {}

  async getAllAlbums() {
    return this.databaseService.getAllAlbums();
  }

  async getAlbumById(id: string) {
    const album = await this.databaseService.getAlbumById(id);
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }

    return album;
  }

  async createAlbum(createAlbumData: CreateAlbumDto) {
    return this.databaseService.createAlbum(createAlbumData);
  }

  async updateAlbum(id: string, updateAlbumData: UpdateAlbumDto) {
    const album = await this.databaseService.updateAlbum(id, updateAlbumData);
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }

    return album;
  }

  async deleteAlbum(id: string) {
    const album = await this.databaseService.deleteAlbum(id);
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
  }
}
