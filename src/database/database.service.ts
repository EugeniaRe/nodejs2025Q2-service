import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/createUser.dto';
import { UpdatePasswordDto } from '../user/dto/updatePassword.dto';
import { CreateArtistDto } from 'src/artist/dto/createArtist.dto';
import { UpdateArtistDto } from 'src/artist/dto/updateArtist.dto';
import { CreateAlbumDto } from 'src/album/dto/createAlbum.dto';
import { UpdateAlbumDto } from 'src/album/dto/updateAlbum.dto';
import { CreateTrackDto } from 'src/track/dto/createTrack.dto';
import { UpdateTrackDto } from 'src/track/dto/updateTrack.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Album } from '../album/album.entity';
import { Artist } from '../artist/artist.entity';
import { Track } from '../track/track.entity';
import { Favorites } from 'src/favorites/favorites.entity';

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

    @InjectRepository(Favorites)
    private favoritesRepository: Repository<Favorites>,
  ) {}

  async getUsers() {
    return await this.usersRepository.find();
  }

  async getUserById(id: string) {
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
      updatedAt: Number(Date.now()),
    });

    const updatedUser = await this.getUserById(id);

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
    const artist = await this.getArtistById(id);
    if (!artist) {
      return false;
    }
    await this.artistRepository.delete(id);

    const tracks = await this.trackRepository.find();
    tracks.map(async (track) => {
      if (track.artistId === id) {
        await this.trackRepository.update(track.id, {
          artistId: null,
        });
      }
    });

    const albums = await this.albumRepository.find();
    albums.map(async (album) => {
      if (album.artistId === id) {
        await this.albumRepository.update(album.id, {
          artistId: null,
        });
      }
    });

    const favs = await this.favoritesRepository.find();
    const f = favs[0].artists.filter((artistId) => artistId !== id);
    await this.favoritesRepository.update(1, {
      artists: f,
    });

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
    return newAlbum;
  }

  async updateAlbum(id: string, updateAlbumData: UpdateAlbumDto) {
    const album = await this.getAlbumById(id);
    if (!album) {
      return undefined;
    }
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
    const album = await this.getAlbumById(id);
    if (!album) {
      return false;
    }
    await this.albumRepository.delete(id);

    const tracks = await this.trackRepository.find();
    tracks.map(async (track) => {
      if (track.albumId === id) {
        await this.trackRepository.update(track.id, {
          albumId: null,
        });
      }
    });

    const favs = await this.favoritesRepository.find();
    await this.favoritesRepository.update(1, {
      albums: favs[0].albums.filter((albumId) => albumId !== id),
    });

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
    return newTrack;
  }

  async updateTrack(id: string, updateTrackData: UpdateTrackDto) {
    const track = await this.trackRepository.findOneBy({ id });
    if (!track) {
      return undefined;
    }
    if (updateTrackData.name !== undefined)
      await this.trackRepository.update(id, {
        name: updateTrackData.name,
      });
    if (updateTrackData.artistId !== undefined)
      await this.trackRepository.update(id, {
        artistId: updateTrackData.artistId,
      });
    if (updateTrackData.albumId !== undefined)
      await this.trackRepository.update(id, {
        albumId: updateTrackData.albumId,
      });
    if (updateTrackData.duration !== undefined)
      await this.trackRepository.update(id, {
        duration: updateTrackData.duration,
      });

    const updatedTrack = await this.trackRepository.findOneBy({ id });
    return updatedTrack;
  }

  async deleteTrack(id: string) {
    const track = await this.trackRepository.findOneBy({ id });
    if (!track) {
      return false;
    }
    await this.trackRepository.delete(id);

    const favs = await this.favoritesRepository.find();
    await this.favoritesRepository.update(1, {
      tracks: favs[0].tracks.filter((trackId) => trackId !== id),
    });

    return true;
  }

  async getAllFavorites() {
    const favs = await this.favoritesRepository.find();
    if (favs.length === 0) {
      return {
        artists: [],
        albums: [],
        tracks: [],
      };
    }

    const albums =
      favs[0].albums.length === 0
        ? []
        : await Promise.all(
            favs[0].albums
              .filter((id) => id !== null)
              .map((id) => this.albumRepository.findOneBy({ id })),
          );

    const artists =
      favs[0].artists.length === 0
        ? []
        : await Promise.all(
            favs[0].artists
              .filter((id) => id !== null)
              .map((id) => this.artistRepository.findOneBy({ id })),
          );

    const tracks =
      favs[0].tracks.length === 0
        ? []
        : await Promise.all(
            favs[0].tracks
              .filter((id) => id !== null)
              .map((id) => this.trackRepository.findOneBy({ id })),
          );

    return {
      albums: albums.filter((album) => album !== null),
      artists: artists.filter((artist) => artist !== null),
      tracks: tracks.filter((track) => track !== null),
    };
  }

  async addFavoriteTrack(id: string) {
    const track = await this.trackRepository.findOneBy({ id });
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    const favs = await this.favoritesRepository.find();
    if (favs.length === 0) {
      await this.favoritesRepository.save({ tracks: [id] });
    } else {
      await this.favoritesRepository.update(1, {
        tracks: [...favs[0].tracks, id],
      });
    }
  }

  async deleteFavoriteTrack(id: string) {
    const favs = await this.favoritesRepository.find();
    if (favs.length === 0 || !favs[0].tracks.includes(id)) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }

    await this.favoritesRepository.update(1, {
      albums: favs[0].tracks.filter((trackId) => trackId !== id),
    });
  }

  async addFavoriteArtist(id: string) {
    const artist = await this.artistRepository.findOneBy({ id });
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    const favs = await this.favoritesRepository.find();
    if (favs.length === 0) {
      await this.favoritesRepository.save({
        id: 1,
        artists: [id],
      });
    } else {
      await this.favoritesRepository.update(1, {
        artists: [...favs[0].artists, id],
      });
    }
  }

  async deleteFavoriteArtist(id: string) {
    const favs = await this.favoritesRepository.find();
    if (favs.length === 0 || !favs[0].artists.includes(id)) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    const f = favs[0].artists.filter((artistId) => artistId !== id);
    await this.favoritesRepository.update(1, {
      artists: f,
    });
  }

  async addFavoriteAlbum(id: string) {
    const album = await this.albumRepository.findOneBy({ id });
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    const favs = await this.favoritesRepository.find();
    if (favs.length === 0) {
      await this.favoritesRepository.save({
        id: 1,
        albums: [id],
      });
    } else {
      await this.favoritesRepository.update(1, {
        albums: [...favs[0].albums, id],
      });
    }
  }

  async deleteFavoriteAlbum(id: string) {
    const favs = await this.favoritesRepository.find();
    if (favs.length === 0 || !favs[0].albums.includes(id)) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }

    await this.favoritesRepository.update(1, {
      albums: favs[0].albums.filter((albumId) => albumId !== id),
    });
  }
}
