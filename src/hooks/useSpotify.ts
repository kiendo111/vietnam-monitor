// src/hooks/useSpotify.ts
import { useState, useEffect } from 'react';
import { getTopTracks, getTopAlbums, getTopArtists } from '../services/spotify';
import type { SpotifyTrack, SpotifyAlbum, SpotifyArtist } from '../types';

export function useSpotify() {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSpotifyData() {
      try {
        setLoading(true);
        const [topTracks, topAlbums, topArtists] = await Promise.all([
          getTopTracks(),
          getTopAlbums(),
          getTopArtists(),
        ]);
        setTracks(topTracks);
        setAlbums(topAlbums);
        setArtists(topArtists);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSpotifyData();
  }, []);

  return { tracks, albums, artists, loading, error };
}
