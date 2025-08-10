import { MediaItem, MediaType, TrackDropPayload } from './types';
import { cn } from '@/lib/utils';

interface TrackProps {
  label: string;
  type: MediaType;
  clips: MediaItem[];
  onDropItem: (payload: TrackDropPayload, targetIndex: number | null, trackType: MediaType) => void;
  onDragStartClip: (e: React.DragEvent, item: MediaItem, index: number, trackType: MediaType) => void;
  activeDropIndex: number | null;
  setActiveDropIndex: (i: number | null) => void;
}

export const Track = ({ label, type, clips, onDropItem, onDragStartClip, activeDropIndex, setActiveDropIndex }: TrackProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropEmpty = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;
    const payload: TrackDropPayload = JSON.parse(data);
    if (payload.source === 'library' && payload.track === null) {
      onDropItem(payload, null, type);
    } else if (payload.source === 'track' && payload.track === type) {
      onDropItem(payload, null, type);
    }
  };

  return (
    <div className="rounded-md border p-3 bg-card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">{label}</h3>
      </div>

      <div
        className={cn(
          'min-h-[72px] rounded-sm bg-muted/40 p-2 flex items-stretch gap-2 overflow-x-auto',
        )}
        onDragOver={handleDragOver}
        onDrop={handleDropEmpty}
        aria-label={`${label} drop zone`}
      >
        {clips.map((clip, idx) => (
          <div
            key={clip.id}
            className={cn(
              'relative shrink-0 rounded border bg-card px-3 py-2 cursor-grab active:cursor-grabbing',
              'transition-colors',
              activeDropIndex === idx ? 'ring-2 ring-primary' : ''
            )}
            draggable
            onDragStart={(e) => onDragStartClip(e, clip, idx, type)}
            onDragOver={(e) => {
              e.preventDefault();
              setActiveDropIndex(idx);
            }}
            onDragLeave={() => setActiveDropIndex(null)}
            onDrop={(e) => {
              e.preventDefault();
              const data = e.dataTransfer.getData('application/json');
              if (!data) return;
              const payload: TrackDropPayload = JSON.parse(data);
              if (payload.source === 'library' && payload.track === null) {
                onDropItem(payload, idx, type);
              } else if (payload.source === 'track' && payload.track === type) {
                onDropItem(payload, idx, type);
              }
              setActiveDropIndex(null);
            }}
          >
            <div className="text-xs font-medium truncate max-w-[160px]" title={clip.name}>
              {clip.name}
            </div>
            {typeof clip.duration === 'number' && (
              <div className="text-[10px] text-muted-foreground">{clip.duration.toFixed(1)}s</div>
            )}
          </div>
        ))}

        {clips.length === 0 && (
          <div className="flex items-center justify-center w-full text-xs text-muted-foreground">
            Drag clips here
          </div>
        )}
      </div>
    </div>
  );
};
