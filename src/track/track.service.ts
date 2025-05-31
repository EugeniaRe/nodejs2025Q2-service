import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Track } from './track.interface';
import { CreateTrackDto } from './dto/createTrack.dto';
import { UpdateTrackDto } from './dto/updateTrack.dto';

@Injectable()
export class TrackService {
  constructor(private databaseService: DatabaseService) {}

  getAllTracks(): Track[] {
    return this.databaseService.getAllTracks();
  }

  getTrackById(id: string): Track | undefined {
    const track = this.databaseService.getTrackById(id);
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    return track;
  }

  createTrack(createTrackData: CreateTrackDto): Track {
    return this.databaseService.createTrack(createTrackData);
  }

  updateTrack(id: string, updateTrackData: UpdateTrackDto): Track {
    const track = this.databaseService.updateTrack(id, updateTrackData);
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    return track;
  }

  deleteTrack(id: string) {
    const track = this.databaseService.deleteTrack(id);
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
  }
}
