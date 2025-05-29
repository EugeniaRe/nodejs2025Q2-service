import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID('4')
  @IsOptional()
  artistId?: string | null;

  @IsUUID('4')
  @IsOptional()
  albumId?: string | null;

  @IsNumber()
  @IsNotEmpty()
  duration: number;
}
