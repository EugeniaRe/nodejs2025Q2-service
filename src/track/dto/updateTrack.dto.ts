import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsUUID('4')
  @IsOptional()
  artistId?: string | null;

  @IsUUID('4')
  @IsOptional()
  albumId?: string | null;

  @IsNumber()
  @IsOptional()
  duration?: number;
}
