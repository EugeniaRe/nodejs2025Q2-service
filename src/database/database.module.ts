import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Album } from 'src/album/album.entity';
import { Artist } from 'src/artist/artist.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Album, Artist])],

  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
