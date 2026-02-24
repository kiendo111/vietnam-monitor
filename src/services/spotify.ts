// src/services/spotify.ts
import type { SpotifyTrack, SpotifyAlbum, SpotifyArtist } from '../types';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

// This function gets an access token from the Spotify API
async function getAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    // NOTE: This will fail if the client secret is not correct
    throw new Error('Failed to get Spotify access token. Please check your credentials.');
  }

  const data = await response.json();
  return data.access_token;
}

// This function gets the top tracks for Vietnam
export async function getTopTracks(): Promise<SpotifyTrack[]> {
  const accessToken = await getAccessToken();

  const response = await fetch('https://api.spotify.com/v1/playlists/37i9dQZEVXbLdGSmz6xilI/tracks?limit=10', {
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  });

  if (!response.ok) {
    throw new Error('Failed to get Spotify top tracks.');
  }

  const data = await response.json();

  return data.items.map((item: any, index: number) => ({
    id: item.track.id,
    rank: index + 1,
    title: item.track.name,
    artist: item.track.artists.map((artist: any) => artist.name).join(', '),
    cover: item.track.album.images[0].url,
  }));
}

// This function gets the top albums for Vietnam
export async function getTopAlbums(): Promise<SpotifyAlbum[]> {
    const accessToken = await getAccessToken();

    const response = await fetch('https://api.spotify.com/v1/browse/new-releases?country=VN&limit=10', {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });

    if (!response.ok) {
        throw new Error('Failed to get Spotify top albums.');
    }

    const data = await response.json();

    return data.albums.items.map((item: any, index: number) => ({
        id: item.id,
        rank: index + 1,
        title: item.name,
        artist: item.artists.map((artist: any) => artist.name).join(', '),
        cover: item.images[0].url,
    }));
}

// This function gets the top artists for Vietnam
export async function getTopArtists(): Promise<SpotifyArtist[]> {
    const accessToken = await getAccessToken();

    const response = await fetch('https://api.spotify.com/v1/artists?ids=4fV2PyE2J6b1w22m3DdyF7,4YjU5Y263rCV23iBGE8cHD,5dfZ5uSmzR7VQK0uG5IeDO,0c1j2LG2weAF7Cq0n4jBci,1z1IKH45x2aA2e5aJ4e4w,2yM5sJfyusY7cKu2fu2u5f,5Y4sO1tN2L5F0n2aC2L2vQ', {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });

    if (!response.ok) {
        throw new Error('Failed to get Spotify top artists.');
    }

    const data = await response.json();

    return data.artists.map((item: any, index: number) => ({
        id: item.id,
        rank: index + 1,
        name: item.name,
        image: item.images[0].url,
    }));
}
