import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { CreateAlbumDto } from './createAlbum.dto';

export class UpdateAlbumDto implements Partial<CreateAlbumDto> {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  year?: number;

  @IsUUID('4')
  @IsOptional()
  artistId?: string | null;
}
