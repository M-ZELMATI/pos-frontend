'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Info, Plus } from 'lucide-react';
// Assuming '@/types/product/product' and '@/components/products/ProductDetails' exist
import { DEFAULT_IMAGE, Product } from '@/types/product/product';
import ProductDetails from '@/components/products/ProductDetails';

const ProductCard = ({ product }: { product: Product }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // We'll use a local state to control the Sheet manually
  // since the trigger is outside the Sheet's JSX block.
  // The 'Info' button will use the SheetTrigger for simplicity and accessibility.

  const handleAddToOrder = () => {
    // This action directly opens the Sheet for customization
    setIsSheetOpen(true);
  };

  // Function to determine the currency symbol
  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      default:
        return currency;
    }
  };

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <Card className="w-70 h-auto hover:shadow-xl transition-all duration-300 border-none rounded-xl p-0 overflow-hidden relative">
          {/* Card Header (Image Section) */}
          <CardContent className="p-0 relative">
            <div className="relative w-full h-70 overflow-hidden">
              <Image
                src={product.images[0]?.url || DEFAULT_IMAGE}
                alt={product.title}
                width={400}
                height={300}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = DEFAULT_IMAGE;
                }}
              />
            </div>

            {/* SheetTrigger for the Info Button:
              This is now correctly nested inside the <Sheet> component block above.
              We use 'asChild' to use our custom <Button> as the trigger. 
            */}
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 rounded-full h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background/95 transition-colors z-10"
                // No explicit onClick needed here, SheetTrigger handles the state change
              >
                <Info className="h-4 w-4 text-muted" />
              </Button>
            </SheetTrigger>

            <div className=" p-2 w-full absolute bottom-0 bg-background/70 backdrop-blur-sm hover:bg-background/95 transition-colors">
              <div className="">
                <h3 className="font-extrabold text-xl leading-snug truncate">{product.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
              </div>

              <div className="flex items-center justify-between">
                {/* Price section */}
                <span className="text-xl font-extrabol font-semibold">
                  {getCurrencySymbol(product.currency)}
                  {product.basePrice.toFixed(2)}
                </span>

                {/* Add to Order Button - uses manual state control */}
                <Button
                  onClick={handleAddToOrder} // This manually sets setIsSheetOpen(true)
                >
                  <Plus />
                  Add
                </Button>
              </div>
            </div>
          </CardContent>

          {/* Card Content (Text, Price, and Button) */}
        </Card>

        {/* Sheet Content (The slide-out panel) */}
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{product.title}</SheetTitle>
            <SheetDescription>Customize your order</SheetDescription>
          </SheetHeader>
          <ProductDetails product={product} mediaList={product.images} />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ProductCard;
