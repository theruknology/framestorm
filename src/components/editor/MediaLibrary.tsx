import { MediaItem, MediaType } from './types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MediaLibraryProps {
  items: MediaItem[];
  onDragStart: (e: React.DragEvent, item: MediaItem) => void;
}

export const MediaLibrary = ({ items, onDragStart }: MediaLibraryProps) => {
  return (
    <section aria-label="Media Library" className="space-y-3">
      <h2 className="text-lg font-semibold">Library</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((item) => (
          <Card
            key={item.id}
            draggable
            onDragStart={(e) => onDragStart(e, item)}
            className="p-3 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md"
            role="button"
            aria-label={`Drag ${item.name} (${item.type})`}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium truncate" title={item.name}>
                {item.name}
              </div>
              <Badge variant="secondary" className="uppercase">
                {item.type}
              </Badge>
            </div>
            {typeof item.duration === 'number' && (
              <p className="text-xs text-muted-foreground mt-1">
                {item.duration.toFixed(1)}s
              </p>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
};
