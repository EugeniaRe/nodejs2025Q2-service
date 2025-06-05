import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User])],

  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
