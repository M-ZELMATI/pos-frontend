'use client';

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

const DEFAULT_IMAGE =
  'https://cdn-websites.autodealersdigital.com/common/images/car_not_found.webp';
export type MediaItem = {
  type: 'image' | 'video';
  url: string;
};

export type ImageObject = {
  id: number;
  uuid: string;
  url: string;
};
export default function ImageCarousel({
  images = [],
  video = '',
  uuid,
}: {
  images?: ImageObject[];
  video?: string;
  uuid?: string;
}) {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params?.id ? params.id : uuid;

  const isDefault = (!images || images.length === 0) && !video;

  const mediaList: MediaItem[] = useMemo(() => {
    const items: MediaItem[] = [];

    // Add images
    if (images.length > 0) {
      items.push(
        ...images
          .filter((img) => typeof img.url === 'string' && img.url.trim() !== '')
          .map(
            (img): MediaItem => ({
              type: 'image',
              url: img.url,
            })
          )
      );
    }
    // Add video if exists and is not empty
    if (video && video.trim() !== '') {
      items.push({ type: 'video', url: video });
    }

    return items.length > 0 ? items : [{ type: 'image', url: DEFAULT_IMAGE }];
  }, [images, video]);

  // Track which video (by index) is currently playing inside the carousel
  const [playingVideoIndex, setPlayingVideoIndex] = useState<number | null>(null);

  const handleVideoClick = (idx: number) => {
    setPlayingVideoIndex(idx);
  };

  const handleUploadClick = () => {
    router.push(`/inventory/${vehicleId}/media`);
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Fixed Carousel Container */}
      <div className="relative w-full h-80 rounded-xl overflow-hidden bg-muted/10">
        <Carousel aria-label="Vehicle Media" className="w-full h-full flex">
          <CarouselContent className="h-full flex">
            {mediaList.map((item, idx) => (
              <CarouselItem key={idx} className="h-full flex items-center justify-center">
                {item.type === 'image' && (
                  <div className="relative w-full h-full flex items-center justify-center bg-foreground rounded-xl overflow-hidden">
                    <Image
                      src={item.url || DEFAULT_IMAGE}
                      alt={`Vehicle image ${idx + 1}`}
                      width={4000}
                      height={320}
                      className="max-w-full max-h-full object-contain rounded-xl"
                      priority={idx === 0}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = DEFAULT_IMAGE;
                      }}
                    />
                  </div>
                )}
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Enhanced Navigation Arrows */}
          {!isDefault && mediaList.length > 1 && (
            <>
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-background/90 hover:bg-background border-border shadow-lg hover:shadow-xl transition-all duration-300 w-12 h-12" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-background/90 hover:bg-background border-border shadow-lg hover:shadow-xl transition-all duration-300 w-12 h-12" />
            </>
          )}
        </Carousel>

        {/* Media counter overlay */}
        {!isDefault && mediaList.length > 1 && (
          <div className="absolute bottom-4 right-4 z-30 bg-foreground/70 text-background px-3 py-1 rounded-full text-sm font-medium">
            {mediaList.length} media
          </div>
        )}
      </div>
    </div>
  );
}
