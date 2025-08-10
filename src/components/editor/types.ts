export type MediaType = 'video' | 'audio';

export interface MediaItem {
  id: string;
  type: MediaType;
  name: string;
  src: string;
  duration?: number; // seconds
  startCut?: number; // start cut time in seconds
  endCut?: number; // end cut time in seconds
}

export interface TimelineData {
  videoTrack: MediaItem[];
  audioTrack: MediaItem[];
  totalDuration: number;
}

export interface TrackDropPayload {
  source: 'library' | 'track';
  track: MediaType | null;
  index: number | null;
  id: string;
}
