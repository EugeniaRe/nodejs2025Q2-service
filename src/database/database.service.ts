import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../user/user.interface';
import { CreateUserDto } from '../user/dto/createUser.dto';
import { UpdatePasswordDto } from '../user/dto/updatePassword.dto';
import { Artist } from 'src/artist/artist.interface';
import { CreateArtistDto } from 'src/artist/dto/createArtist.dto';
import { UpdateArtistDto } from 'src/artist/dto/updateArtist.dto';
import { Album } from 'src/album/album.interface';
import { CreateAlbumDto } from 'src/album/dto/createAlbum.dto';
import { UpdateAlbumDto } from 'src/album/dto/updateAlbum.dto';
import { Track } from 'src/track/track.interface';
import { CreateTrackDto } from 'src/track/dto/createTrack.dto';
import { UpdateTrackDto } from 'src/track/dto/updateTrack.dto';
import { Favorites } from 'src/favorites/interfaces/favorites.interface';
import { FavoritesResponse } from 'src/favorites/interfaces/favoritesResponse.interface';

@Injectable()
export class DatabaseService {
  private users: User[] = [];
  private artists: Artist[] = [];
  private albums: Album[] = [];
  private tracks: Track[] = [];
  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  // private getAll<T>(data: T[]): T[] {
  //   return data;
  // }

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

  // private updateItem<T extends { id: string }, Uto>(
  //   data: T[],
  //   id: string,
  //   dto: Uto,
  //   updateLogic: (item: T, updateDto: Uto) => void,
  // ): T | undefined {
  //   const index = data.findIndex((item) => item.id === id);
  //   if (index === -1) {
  //     return undefined;
  //   }
  //   const item = data[index];
  //   updateLogic(item, dto);

  //   return item;
  // }

  private filterArrayAndCheckDeletion<T extends { id: string }>(
    dataArray: T[],
    idToRemove: string,
  ): { newArray: T[]; wasDeleted: boolean } {
    const initialLength = dataArray.length;
    const newArray = dataArray.filter((item) => item.id !== idToRemove);
    const wasDeleted = newArray.length < initialLength;
    return { newArray, wasDeleted };
  }

  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.findById(this.users, id);
  }

  createUser(createUserData: CreateUserDto): User {
    const createdTime = Date.now();
    const newUser = this.createItem(this.users, createUserData, {
      login: createUserData.login,
      password: createUserData.password,
      version: 1,
      createdAt: createdTime,
      updatedAt: createdTime,
    });
    return newUser;
  }

  updateUser(
    id: string,
    updatePasswordData: UpdatePasswordDto,
  ): User | undefined | null {
    const user = this.getUserById(id);
    if (!user) {
      return undefined;
    }

    if (user.password !== updatePasswordData.oldPassword) {
      return null;
    }

    user.password = updatePasswordData.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    return user;
  }

  deleteUser(id: string): boolean {
    const { newArray, wasDeleted } = this.filterArrayAndCheckDeletion(
      this.users,
      id,
    );
    if (wasDeleted) {
      this.users = newArray;
    }
    return wasDeleted;
  }

  getArtists(): Artist[] {
    return this.artists;
  }

  getArtistById(id: string): Artist | undefined {
    return this.findById(this.artists, id);
  }

  createArtist(createArtistData: CreateArtistDto): Artist {
    const newArtist = this.createItem(this.artists, createArtistData, {
      name: createArtistData.name,
      grammy: createArtistData.grammy,
    });
    return newArtist;
  }

  updateArtist(id: string, updateArtistData: UpdateArtistDto) {
    const artist = this.getArtistById(id);
    if (!artist) {
      return undefined;
    }
    if (updateArtistData.name !== undefined)
      artist.name = updateArtistData.name;
    if (updateArtistData.grammy !== undefined)
      artist.grammy = updateArtistData.grammy;
    return artist;
  }
  deleteArtist(id: string): boolean {
    const { newArray, wasDeleted } = this.filterArrayAndCheckDeletion(
      this.artists,
      id,
    );
    if (wasDeleted) {
      this.artists = newArray;
      this.tracks.find((track) => {
        if (track.artistId === id) {
          track.artistId = null;
        }
      });
      this.albums.find((album) => {
        if (album.artistId === id) {
          album.artistId = null;
        }
      });
    }
    return wasDeleted;
  }

  getAllAlbums(): Album[] {
    return this.albums;
  }

  getAlbumById(id: string): Album | undefined {
    return this.findById(this.albums, id);
  }

  createAlbum(createAlbumData: CreateAlbumDto): Album {
    const newAlbum = this.createItem(this.albums, createAlbumData, {
      name: createAlbumData.name,
      year: createAlbumData.year,
      artistId: createAlbumData.artistId,
    });
    return newAlbum;
  }

  updateAlbum(id: string, updateAlbumData: UpdateAlbumDto) {
    const album = this.getAlbumById(id);
    if (!album) {
      return undefined;
    }
    if (updateAlbumData.name !== undefined) album.name = updateAlbumData.name;
    if (updateAlbumData.year !== undefined) album.year = updateAlbumData.year;
    if (updateAlbumData.artistId !== undefined)
      album.artistId = updateAlbumData.artistId;
    return album;
  }

  deleteAlbum(id: string): boolean {
    const { newArray, wasDeleted } = this.filterArrayAndCheckDeletion(
      this.albums,
      id,
    );
    if (wasDeleted) {
      this.albums = newArray;
      this.tracks.find((track) => {
        if (track.albumId === id) {
          track.albumId = null;
        }
      });
    }
    return wasDeleted;
  }

  getAllTracks(): Track[] {
    return this.tracks;
  }

  getTrackById(id: string): Track | undefined {
    return this.findById(this.tracks, id);
  }

  createTrack(createTrackData: CreateTrackDto): Track {
    const newTrack = this.createItem(this.tracks, createTrackData, {
      name: createTrackData.name,
      artistId: createTrackData.artistId,
      albumId: createTrackData.albumId,
      duration: createTrackData.duration,
    });
    return newTrack;
  }

  updateTrack(id: string, updateTrackData: UpdateTrackDto) {
    const track = this.getTrackById(id);
    if (!track) {
      return undefined;
    }
    if (updateTrackData.name !== undefined) track.name = updateTrackData.name;
    if (updateTrackData.artistId !== undefined)
      track.artistId = updateTrackData.artistId;
    if (updateTrackData.albumId !== undefined)
      track.albumId = updateTrackData.albumId;
    if (updateTrackData.duration !== undefined)
      track.duration = updateTrackData.duration;
    return track;
  }

  deleteTrack(id: string): boolean {
    const { newArray, wasDeleted } = this.filterArrayAndCheckDeletion(
      this.tracks,
      id,
    );
    if (wasDeleted) {
      this.tracks = newArray;
    }
    return wasDeleted;
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
