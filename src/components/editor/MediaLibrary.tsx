import { MediaItem } from './types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Film, Music2 } from 'lucide-react';

interface MediaLibraryProps {
  items: MediaItem[];
  onDragStart: (e: React.DragEvent, item: MediaItem) => void;
}

export const MediaLibrary = ({ items, onDragStart }: MediaLibraryProps) => {
  return (
    <section aria-label="Media Library" className="space-y-3">
      <h2 className="text-lg font-semibold">Library</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => (
          <Card
            key={item.id}
            draggable
            onDragStart={(e) => onDragStart(e, item)}
            className="p-3 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md"
            role="button"
            aria-label={`Drag ${item.name} (${item.type})`}
            title={item.name}
          >
            <div className="relative">
              <AspectRatio ratio={1} className="rounded-md bg-muted/60 flex items-center justify-center">
                {item.type === 'video' ? (
                  <Film className="h-8 w-8 text-muted-foreground" />
                ) : (
                  <Music2 className="h-8 w-8 text-muted-foreground" />
                )}
              </AspectRatio>
              <Badge variant="secondary" className="absolute top-2 right-2 uppercase">
                {item.type}
              </Badge>
            </div>
            <div className="mt-2">
              <div className="text-sm font-medium truncate" title={item.name}>
                {item.name}
              </div>
              {typeof item.duration === 'number' && (
                <p className="text-xs text-muted-foreground mt-0.5">{item.duration.toFixed(1)}s</p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
