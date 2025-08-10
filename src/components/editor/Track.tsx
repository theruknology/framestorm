import { useEffect, useMemo, useRef, useState } from 'react';
import { MediaItem, MediaType, TrackDropPayload } from './types';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

interface TrackProps {
  label: string;
  type: MediaType;
  clips: MediaItem[];
  onDropItem: (payload: TrackDropPayload, targetIndex: number | null, trackType: MediaType) => void;
  onDragStartClip: (e: React.DragEvent, item: MediaItem, index: number, trackType: MediaType) => void;
  onDeleteClip: (index: number, trackType: MediaType) => void;
  activeDropIndex: number | null;
  setActiveDropIndex: (i: number | null) => void;
}

export const Track = ({ 
  label, 
  type, 
  clips, 
  onDropItem, 
  onDragStartClip, 
  onDeleteClip,
  activeDropIndex, 
  setActiveDropIndex 
}: TrackProps) => {
  const pxPerSecond = 50; // visual scale only
  const minWidth = 96;
  const [widths, setWidths] = useState<Record<string, number>>({});

  const keyFor = (clip: MediaItem, idx: number) => `${clip.id}-${idx}`;
  const defaultWidth = (clip: MediaItem) => Math.max(minWidth, (clip.duration ?? 2) * pxPerSecond);

  useEffect(() => {
    setWidths((prev) => {
      const next = { ...prev };
      clips.forEach((c, i) => {
        const k = keyFor(c, i);
        if (!(k in next)) next[k] = defaultWidth(c);
      });
      return next;
    });
  }, [clips]);

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

  const startResize = (e: React.MouseEvent, clip: MediaItem, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    const k = keyFor(clip, idx);
    const startX = e.clientX;
    const startW = widths[k] ?? defaultWidth(clip);

    const onMove = (ev: MouseEvent) => {
      const delta = ev.clientX - startX;
      setWidths((prev) => ({ ...prev, [k]: Math.max(minWidth, startW + delta) }));
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
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
        {clips.map((clip, idx) => {
          const k = keyFor(clip, idx);
          const w = widths[k] ?? defaultWidth(clip);
          return (
            <div
              key={k}
              className={cn(
                'relative shrink-0 rounded border bg-card px-3 py-2 cursor-grab active:cursor-grabbing',
                'transition-colors group',
                activeDropIndex === idx ? 'ring-2 ring-primary' : ''
              )}
              style={{ width: w }}
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
              <div className="flex items-center justify-between w-full gap-2">
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium truncate max-w-full pr-4" title={clip.name}>
                    {clip.name}
                  </div>
                  {typeof clip.duration === 'number' && (
                    <div className="text-[10px] text-muted-foreground">{clip.duration.toFixed(1)}s</div>
                  )}
                </div>
                <button
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClip(idx, type);
                  }}
                  title="Delete clip"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              <div
                className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize bg-transparent group-hover:bg-primary/30"
                onMouseDown={(e) => startResize(e, clip, idx)}
                aria-label="Resize clip"
                role="separator"
              />
            </div>
          );
        })}

        {clips.length === 0 && (
          <div className="flex items-center justify-center w-full text-xs text-muted-foreground">
            Drag clips here
          </div>
        )}
      </div>
    </div>
  );
};
