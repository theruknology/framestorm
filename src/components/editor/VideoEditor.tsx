import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MediaItem, MediaType, TrackDropPayload, TimelineData } from './types';
import { MediaLibrary } from './MediaLibrary';
import { Track } from './Track';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Play, Square, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialLibrary: MediaItem[] = [
  { id: 'vid-1', type: 'video', name: 'Flower (MP4)', src: '/media/videos/flower.mp4' },
  { id: 'vid-2', type: 'video', name: 'Big Buck Bunny (1MB)', src: '/media/videos/big_buck_bunny_1mb.mp4' },
  { id: 'aud-1', type: 'audio', name: 'T-Rex Roar', src: '/media/audios/t-rex-roar.mp3' },
  { id: 'aud-2', type: 'audio', name: 'Piano 2', src: '/media/audios/piano2.wav' },
];

async function getMediaDuration(src: string, type: MediaType): Promise<number> {
  return new Promise((resolve, reject) => {
    let el: HTMLMediaElement;
    if (type === 'video') {
      el = document.createElement('video');
    } else {
      el = document.createElement('audio');
    }
    const cleanup = () => {
      el.removeAttribute('src');
      el.load();
    };
    el.preload = 'metadata';
    el.src = src;
    el.onloadedmetadata = () => {
      const d = el.duration;
      cleanup();
      if (isFinite(d)) resolve(d); else resolve(0);
    };
    el.onerror = () => {
      cleanup();
      reject(new Error('Failed to load media metadata'));
    };
  });
}

export const VideoEditor = () => {
  const [library, setLibrary] = useState<MediaItem[]>(initialLibrary);
  const [videoTrack, setVideoTrack] = useState<MediaItem[]>([]);
  const [audioTrack, setAudioTrack] = useState<MediaItem[]>([]);
  const [activeDropIndex, setActiveDropIndex] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const [videoIndex, setVideoIndex] = useState(0);
  const [audioIndex, setAudioIndex] = useState(0);
  const { toast } = useToast();

  // Preload durations lazily when first seen
  useEffect(() => {
    const fillDurations = async () => {
      const updated: MediaItem[] = [];
      for (const item of library) {
        if (typeof item.duration !== 'number') {
          try {
            const d = await getMediaDuration(item.src, item.type);
            updated.push({ ...item, duration: d });
          } catch {
            updated.push({ ...item, duration: 0 });
          }
        } else {
          updated.push(item);
        }
      }
      setLibrary(updated);
    };
    fillDurations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLibraryDragStart = (e: React.DragEvent, item: MediaItem) => {
    const payload: TrackDropPayload = { source: 'library', track: null, index: null, id: item.id };
    e.dataTransfer.setData('application/json', JSON.stringify(payload));
  };

  const onDragStartClip = (e: React.DragEvent, item: MediaItem, index: number, trackType: MediaType) => {
    const payload: TrackDropPayload = { source: 'track', track: trackType, index, id: item.id };
    e.dataTransfer.setData('application/json', JSON.stringify(payload));
  };

  const resolveItemById = (id: string) => library.find((i) => i.id === id);

  const onDropItem = (payload: TrackDropPayload, targetIndex: number | null, trackType: MediaType) => {
    const item = resolveItemById(payload.id);
    if (!item || item.type !== trackType) return;

    if (trackType === 'video') {
      setVideoTrack((prev) => {
        let arr = [...prev];
        if (payload.source === 'track' && payload.track === 'video' && payload.index !== null) {
          // moving within same track
          const [moved] = arr.splice(payload.index, 1);
          const insertAt = targetIndex === null ? arr.length : Math.max(0, Math.min(arr.length, targetIndex));
          arr.splice(insertAt, 0, moved);
          return arr;
        }
        // from library
        const insertAt = targetIndex === null ? arr.length : Math.max(0, Math.min(arr.length, targetIndex));
        arr.splice(insertAt, 0, item);
        return arr;
      });
    } else {
      setAudioTrack((prev) => {
        let arr = [...prev];
        if (payload.source === 'track' && payload.track === 'audio' && payload.index !== null) {
          const [moved] = arr.splice(payload.index, 1);
          const insertAt = targetIndex === null ? arr.length : Math.max(0, Math.min(arr.length, targetIndex));
          arr.splice(insertAt, 0, moved);
          return arr;
        }
        const insertAt = targetIndex === null ? arr.length : Math.max(0, Math.min(arr.length, targetIndex));
        arr.splice(insertAt, 0, item);
        return arr;
      });
    }
  };

  const totalVideoDuration = useMemo(() => videoTrack.reduce((s, c) => s + (c.duration || 0), 0), [videoTrack]);
  const totalAudioDuration = useMemo(() => audioTrack.reduce((s, c) => s + (c.duration || 0), 0), [audioTrack]);

  const resetPlayback = useCallback(() => {
    setIsPlaying(false);
    setVideoIndex(0);
    setAudioIndex(0);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
    }
  }, []);

  const playNextVideo = useCallback(async (start: number) => {
    const v = videoRef.current;
    if (!v) return;
    const clip = videoTrack[start];
    if (!clip) return;
    v.src = clip.src;
    v.muted = true; // audio comes from audio track
    try {
      await v.play();
    } catch {}
  }, [videoTrack]);

  const playNextAudio = useCallback(async (start: number) => {
    const a = audioRef.current;
    if (!a) return;
    const clip = audioTrack[start];
    if (!clip) return;
    a.src = clip.src;
    try {
      await a.play();
    } catch {}
  }, [audioTrack]);

  const handlePlay = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setVideoIndex(0);
    setAudioIndex(0);
    if (videoTrack.length > 0) await playNextVideo(0);
    if (audioTrack.length > 0) await playNextAudio(0);
  };

  const handleStop = () => {
    resetPlayback();
    if (isRecording && recorderRef.current) {
      try { recorderRef.current.stop(); } catch {}
      setIsRecording(false);
    }
  };

  const handleDeleteClip = (index: number, trackType: MediaType) => {
    if (trackType === 'video') {
      setVideoTrack(prev => {
        const newTrack = [...prev];
        newTrack.splice(index, 1);
        return newTrack;
      });
    } else {
      setAudioTrack(prev => {
        const newTrack = [...prev];
        newTrack.splice(index, 1);
        return newTrack;
      });
    }
  };

  const handleExport = async () => {
    if (videoTrack.length === 0 && audioTrack.length === 0) {
      toast({ title: 'Nothing to export', description: 'Add at least one clip.', });
      return;
    }

    setIsExporting(true);
    toast({ title: 'Preparing export', description: 'Processing timeline data...' });

    // Prepare timeline data for export
    const timelineData: TimelineData = {
      videoTrack: videoTrack.map(clip => ({
        ...clip,
        startCut: 0, // You would get these from UI controls
        endCut: clip.duration
      })),
      audioTrack: audioTrack.map(clip => ({
        ...clip,
        startCut: 0, // You would get these from UI controls
        endCut: clip.duration
      })),
      totalDuration: Math.max(totalVideoDuration, totalAudioDuration)
    };

    try {
      // Here you would send the data to your backend
      // For now, we'll simulate a backend call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({ 
        title: 'Export complete', 
        description: 'Your video is being processed on the server.' 
      });
    } catch (error) {
      toast({ 
        title: 'Export failed', 
        description: 'Failed to process the timeline data. Please try again.' 
      });
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onEnded = async () => {
      setVideoIndex((i) => {
        const next = i + 1;
        if (next < videoTrack.length) {
          void playNextVideo(next);
          return next;
        }
        return i;
      });
    };
    v.addEventListener('ended', onEnded);
    return () => v.removeEventListener('ended', onEnded);
  }, [videoTrack.length, playNextVideo]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onEnded = async () => {
      setAudioIndex((i) => {
        const next = i + 1;
        if (next < audioTrack.length) {
          void playNextAudio(next);
          return next;
        }
        return i;
      });
    };
    a.addEventListener('ended', onEnded);
    return () => a.removeEventListener('ended', onEnded);
  }, [audioTrack.length, playNextAudio]);

  return (
    <main className="container mx-auto py-6 space-y-6 font-sans">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Video Editor</h1>
        <p className="text-muted-foreground">Two-track timeline: drag-and-drop video and audio clips.</p>
      </header>

      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Button onClick={handlePlay} disabled={isPlaying || (videoTrack.length === 0 && audioTrack.length === 0)}>
              <Play className="mr-2 h-4 w-4" /> Play
            </Button>
            <Button variant="secondary" onClick={handleStop} disabled={!isPlaying && !isRecording}>
              <Square className="mr-2 h-4 w-4" /> Stop
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExport} 
              disabled={isExporting || (videoTrack.length === 0 && audioTrack.length === 0)}
            >
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="text-xs text-muted-foreground">
              Video: {totalVideoDuration.toFixed(1)}s · Audio: {totalAudioDuration.toFixed(1)}s
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8">
              <video ref={videoRef} controls className="w-full rounded bg-muted" playsInline />
              <audio ref={audioRef} className="sr-only" aria-hidden="true" />
            </div>
            <div className="lg:col-span-4">
              <MediaLibrary items={library} onDragStart={onLibraryDragStart} />
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <Track
            label="Video Track"
            type="video"
            clips={videoTrack}
            onDropItem={onDropItem}
            onDragStartClip={onDragStartClip}
            onDeleteClip={handleDeleteClip}
            activeDropIndex={activeDropIndex}
            setActiveDropIndex={setActiveDropIndex}
          />
          <Track
            label="Audio Track"
            type="audio"
            clips={audioTrack}
            onDropItem={onDropItem}
            onDragStartClip={onDragStartClip}
            onDeleteClip={handleDeleteClip}
            activeDropIndex={activeDropIndex}
            setActiveDropIndex={setActiveDropIndex}
          />
        </div>
      </div>
    </main>
  );
};
