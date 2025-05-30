import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID('4')
  artistId?: string | null;

  @IsUUID('4')
  albumId?: string | null;

  @IsNumber()
  @IsNotEmpty()
  duration: number;
}
