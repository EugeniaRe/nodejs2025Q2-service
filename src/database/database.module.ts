import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Album } from 'src/album/album.entity';
import { Artist } from 'src/artist/artist.entity';
import { Track } from 'src/track/track.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Album, Artist, Track])],

  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
