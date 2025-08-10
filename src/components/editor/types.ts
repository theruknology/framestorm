export type MediaType = 'video' | 'audio';

export interface MediaItem {
  id: string;
  type: MediaType;
  name: string;
  src: string;
  duration?: number; // seconds
}

export interface TrackDropPayload {
  source: 'library' | 'track';
  track: MediaType | null;
  index: number | null;
  id: string;
}
