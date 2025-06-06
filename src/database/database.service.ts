import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User as UserInterface } from '../user/user.interface';
import { CreateUserDto } from '../user/dto/createUser.dto';
import { UpdatePasswordDto } from '../user/dto/updatePassword.dto';
// import { Artist } from 'src/artist/artist.interface';
import { CreateArtistDto } from 'src/artist/dto/createArtist.dto';
import { UpdateArtistDto } from 'src/artist/dto/updateArtist.dto';
// import { Album } from 'src/album/album.interface';
import { CreateAlbumDto } from 'src/album/dto/createAlbum.dto';
import { UpdateAlbumDto } from 'src/album/dto/updateAlbum.dto';
import { CreateTrackDto } from 'src/track/dto/createTrack.dto';
import { UpdateTrackDto } from 'src/track/dto/updateTrack.dto';
import { Favorites } from 'src/favorites/interfaces/favorites.interface';
import { FavoritesResponse } from 'src/favorites/interfaces/favoritesResponse.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Album } from '../album/album.entity';
import { Artist } from '../artist/artist.entity';
import { Track } from '../track/track.entity';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Album)
    private albumRepository: Repository<Album>,

    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,

    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
  ) {}

  private users: UserInterface[] = [];
  private artists: Artist[] = [];
  private albums: Album[] = [];
  private tracks: Track[] = [];
  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  private findById<T extends { id: string }>(
    data: T[],
    id: string,
  ): T | undefined {
    return data.find((item) => item.id === id);
  }

  private createItem<T extends { id: string }, createDto>(
    data: T[],
    dto: createDto,
    newItemPartial: Omit<T, 'id'>,
  ): T {
    const newItem: T = {
      id: uuidv4(),
      ...newItemPartial,
    } as T;
    data.push(newItem);
    return newItem;
  }

  private filterArrayAndCheckDeletion<T extends { id: string }>(
    dataArray: T[],
    idToRemove: string,
  ): { newArray: T[]; wasDeleted: boolean } {
    const initialLength = dataArray.length;
    const newArray = dataArray.filter((item) => item.id !== idToRemove);
    const wasDeleted = newArray.length < initialLength;
    return { newArray, wasDeleted };
  }

  async getUsers() {
    return await this.usersRepository.find();
  }

  async getUserById(id: string) {
    // return this.findById(this.users, id);
    return await this.usersRepository.findOneBy({ id });
  }

  async createUser(createUserData: CreateUserDto) {
    const createdTime = Date.now();
    const user = await this.usersRepository.save({
      login: createUserData.login,
      password: createUserData.password,
      version: 1,
      createdAt: createdTime,
      updatedAt: createdTime,
    });
    return user;
    // const newUser = this.createItem(this.users, createUserData, {
    //   login: createUserData.login,
    //   password: createUserData.password,
    //   version: 1,
    //   createdAt: createdTime,
    //   updatedAt: createdTime,
    // });
    // return newUser;
  }

  async updateUser(id: string, updatePasswordData: UpdatePasswordDto) {
    const user = await this.getUserById(id);
    if (!user) {
      return undefined;
    }

    if (user.password !== updatePasswordData.oldPassword) {
      return null;
    }

    await this.usersRepository.update(id, {
      password: updatePasswordData.newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    });

    const updatedUser = await this.getUserById(id);

    console.log(typeof updatedUser.updatedAt);

    return updatedUser;
  }

  async deleteUser(id: string) {
    const user = await this.getUserById(id);
    if (!user) {
      return false;
    }

    await this.usersRepository.delete(id);

    return true;
  }

  async getArtists() {
    return this.artistRepository.find();
  }

  async getArtistById(id: string) {
    return this.artistRepository.findOneBy({ id });
  }

  async createArtist(createArtistData: CreateArtistDto) {
    const newArtist = await this.artistRepository.save({
      name: createArtistData.name,
      grammy: createArtistData.grammy,
    });
    // const newArtist = this.createItem(this.artists, createArtistData, {
    //   name: createArtistData.name,
    //   grammy: createArtistData.grammy,
    // });
    return newArtist;
  }

  async updateArtist(id: string, updateArtistData: UpdateArtistDto) {
    const artist = this.getArtistById(id);
    if (!artist) {
      return undefined;
    }
    if (updateArtistData.name !== undefined)
      await this.artistRepository.update(id, {
        name: updateArtistData.name,
      });
    if (updateArtistData.grammy !== undefined)
      await this.artistRepository.update(id, {
        grammy: updateArtistData.grammy,
      });

    const updatedArtist = await this.getArtistById(id);
    return updatedArtist;
  }
  async deleteArtist(id: string) {
    // const { newArray, wasDeleted } = this.filterArrayAndCheckDeletion(
    //   this.artists,
    //   id,
    // );
    // if (wasDeleted) {
    //   this.artists = newArray;
    //   this.tracks.find((track) => {
    //     if (track.artistId === id) {
    //       track.artistId = null;
    //     }
    //   });
    //   this.albums.find((album) => {
    //     if (album.artistId === id) {
    //       album.artistId = null;
    //     }
    //   });
    //   this.favorites.artists = this.favorites.artists.filter(
    //     (favId) => favId !== id,
    //   );
    // }
    // return wasDeleted;
    const artist = await this.getArtistById(id);
    if (!artist) {
      return false;
    }
    await this.artistRepository.delete(id);

    return true;
  }

  async getAllAlbums() {
    return this.albumRepository.find();
  }

  async getAlbumById(id: string) {
    return this.albumRepository.findOneBy({ id });
  }

  async createAlbum(createAlbumData: CreateAlbumDto) {
    const newAlbum = await this.albumRepository.save(createAlbumData);
    // const newAlbum = this.createItem(this.albums, createAlbumData, {
    //   name: createAlbumData.name,
    //   year: createAlbumData.year,
    //   artistId: createAlbumData.artistId,
    // });
    return newAlbum;
  }

  async updateAlbum(id: string, updateAlbumData: UpdateAlbumDto) {
    const album = await this.getAlbumById(id);
    if (!album) {
      return undefined;
    }
    // if (updateAlbumData.name !== undefined) album.name = updateAlbumData.name;
    // if (updateAlbumData.year !== undefined) album.year = updateAlbumData.year;
    // if (updateAlbumData.artistId !== undefined)
    //   album.artistId = updateAlbumData.artistId;
    if (updateAlbumData.name !== undefined)
      await this.albumRepository.update(id, {
        name: updateAlbumData.name,
      });
    if (updateAlbumData.year !== undefined)
      await this.albumRepository.update(id, {
        year: updateAlbumData.year,
      });
    if (updateAlbumData.artistId !== undefined)
      await this.albumRepository.update(id, {
        artistId: updateAlbumData.artistId,
      });

    const updatedAlbum = await this.getAlbumById(id);

    return updatedAlbum;
  }

  async deleteAlbum(id: string) {
    // const { newArray, wasDeleted } = this.filterArrayAndCheckDeletion(
    //   this.albums,
    //   id,
    // );
    // if (wasDeleted) {
    //   this.albums = newArray;
    //   this.tracks.find((track) => {
    //     if (track.albumId === id) {
    //       track.albumId = null;
    //     }
    //   });
    //   this.favorites.albums = this.favorites.albums.filter(
    //     (favId) => favId !== id,
    //   );
    // }
    // return wasDeleted;

    const album = await this.getAlbumById(id);
    if (!album) {
      return false;
    }
    await this.albumRepository.delete(id);

    return true;
  }

  async getAllTracks() {
    return this.trackRepository.find();
  }

  async getTrackById(id: string) {
    return this.trackRepository.findOneBy({ id });
  }

  async createTrack(createTrackData: CreateTrackDto) {
    const newTrack = await this.trackRepository.save(createTrackData);
    // const newTrack = this.createItem(this.tracks, createTrackData, {
    //   name: createTrackData.name,
    //   artistId: createTrackData.artistId,
    //   albumId: createTrackData.albumId,
    //   duration: createTrackData.duration,
    // });
    return newTrack;
  }

  async updateTrack(id: string, updateTrackData: UpdateTrackDto) {
    const track = await this.trackRepository.findOneBy({ id });
    if (!track) {
      return undefined;
    }
    if (updateTrackData.name !== undefined)
      // track.name = updateTrackData.name;
      await this.trackRepository.update(id, {
        name: updateTrackData.name,
      });
    if (updateTrackData.artistId !== undefined)
      await this.trackRepository.update(id, {
        artistId: updateTrackData.artistId,
      });
    // track.artistId = updateTrackData.artistId;
    if (updateTrackData.albumId !== undefined)
      await this.trackRepository.update(id, {
        albumId: updateTrackData.albumId,
      });
    // track.albumId = updateTrackData.albumId;
    if (updateTrackData.duration !== undefined)
      await this.trackRepository.update(id, {
        duration: updateTrackData.duration,
      });
    // track.duration = updateTrackData.duration;

    const updatedTrack = await this.trackRepository.findOneBy({ id });
    return updatedTrack;
  }

  async deleteTrack(id: string) {
    // const { newArray, wasDeleted } = this.filterArrayAndCheckDeletion(
    //   this.tracks,
    //   id,
    // );
    // if (wasDeleted) {
    //   this.tracks = newArray;
    //   this.favorites.tracks = this.favorites.tracks.filter(
    //     (favId) => favId !== id,
    //   );
    // }
    const track = this.findById(this.tracks, id);
    if (!track) {
      return false;
    }
    await this.trackRepository.delete(id);

    return true;
  }

  getAllFavorites(): FavoritesResponse {
    const albums = this.favorites.albums
      .map((id) => this.findById(this.albums, id))
      .filter((album): album is Album => album !== undefined);
    const artists = this.favorites.artists
      .map((id) => this.findById(this.artists, id))
      .filter((artist): artist is Artist => artist !== undefined);
    const tracks = this.favorites.tracks
      .map((id) => this.findById(this.tracks, id))
      .filter((track): track is Track => track !== undefined);
    return { albums, artists, tracks };
  }

  addFavoriteTrack(id: string): void {
    const track = this.findById(this.tracks, id);
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    if (!this.favorites.tracks.includes(id)) {
      this.favorites.tracks.push(id);
    }
  }

  deleteFavoriteTrack(id: string): void {
    const favsLength = this.favorites.tracks.length;
    this.favorites.tracks = this.favorites.tracks.filter(
      (trackId) => trackId !== id,
    );

    if (this.favorites.tracks.length === favsLength) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
  }

  addFavoriteArtist(id: string): void {
    const artist = this.findById(this.artists, id);
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    if (!this.favorites.artists.includes(id)) {
      this.favorites.artists.push(id);
    }
  }

  deleteFavoriteArtist(id: string): void {
    const favsLength = this.favorites.artists.length;
    this.favorites.artists = this.favorites.artists.filter(
      (artistId) => artistId !== id,
    );

    if (this.favorites.artists.length === favsLength) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
  }

  addFavoriteAlbum(id: string): void {
    const album = this.findById(this.albums, id);
    if (!album) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    if (!this.favorites.albums.includes(id)) {
      this.favorites.albums.push(id);
    }
  }

  deleteFavoriteAlbum(id: string): void {
    const favsLength = this.favorites.albums.length;
    this.favorites.albums = this.favorites.albums.filter(
      (albumId) => albumId !== id,
    );

    if (this.favorites.albums.length === favsLength) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
  }
}
