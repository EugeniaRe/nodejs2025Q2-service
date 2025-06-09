import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateTrackDto } from './dto/createTrack.dto';
import { UpdateTrackDto } from './dto/updateTrack.dto';

@Injectable()
export class TrackService {
  constructor(private databaseService: DatabaseService) {}

  async getAllTracks() {
    return this.databaseService.getAllTracks();
  }

  async getTrackById(id: string) {
    const track = await this.databaseService.getTrackById(id);
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }

    return track;
  }

  async createTrack(createTrackData: CreateTrackDto) {
    return this.databaseService.createTrack(createTrackData);
  }

  async updateTrack(id: string, updateTrackData: UpdateTrackDto) {
    const track = await this.databaseService.updateTrack(id, updateTrackData);
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }

    return track;
  }

  async deleteTrack(id: string) {
    const track = await this.databaseService.deleteTrack(id);
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
  }
}
