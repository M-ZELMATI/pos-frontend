import ImageCarousel, { ImageObject } from '@/components/media/ImageCarousel';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product/product';
import { Info, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

const ProductDetails = ({ product, mediaList }: { product: Product; mediaList: ImageObject[] }) => {
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedTemp, setSelectedTemp] = useState('Hot');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const calculatedPrice = useMemo(() => {
    const sizePrice = product.sizes.find((s) => s.name === selectedSize)?.priceModifier || 0;
    const tempPrice = product.temperatures.find((t) => t.name === selectedTemp)?.priceModifier || 0;
    return product.basePrice + sizePrice + tempPrice;
  }, [selectedSize, selectedTemp, product]);

  const handleAddToOrder = () => {
    setIsSheetOpen(true);
  };

  const handleConfirmOrder = () => {
    console.log('Order confirmed:', {
      product: product.title,
      size: selectedSize,
      temperature: selectedTemp,
      price: calculatedPrice,
    });
    setIsSheetOpen(false);
    // Add your order logic here
  };

  return (
    <div className="mt-6 space-y-6 p-5">
      {/* Image Carousel */}
      <div className="relative w-full h-64 rounded-xl overflow-hidden bg-muted/10">
        <ImageCarousel images={mediaList} />
      </div>

      {/* Price Display */}

      {/* Size Selection */}
      <div>
        <label className="text-sm font-semibold mb-3 block">Select Size</label>
        <div className="grid grid-cols-3 gap-3">
          {product.sizes.map((size) => (
            <Button
              key={size.name}
              variant={selectedSize === size.name ? 'default' : 'outline'}
              size="lg"
              className=" flex flex-row"
              onClick={() => setSelectedSize(size.name)}
            >
              <span className="text-lg font-semibold">{size.name}</span>
              {size.priceModifier !== 0 && (
                <span className="text-xs">
                  ({size.priceModifier > 0 ? '+' : ''}${size.priceModifier.toFixed(2)})
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Temperature Selection */}
      <div>
        <label className="text-sm font-semibold mb-3 block">Select Temperature</label>
        <div className="grid grid-cols-2 gap-3">
          {product.temperatures.map((temp) => (
            <Button
              key={temp.name}
              variant={selectedTemp === temp.name ? 'default' : 'outline'}
              size="lg"
              className=" lex flex-row"
              onClick={() => setSelectedTemp(temp.name)}
            >
              <span className="text-lg font-semibold f">{temp.name}</span>
              {temp.priceModifier !== 0 && (
                <span className="text-xs ">
                  ({temp.priceModifier > 0 ? '+' : ''}${temp.priceModifier.toFixed(2)})
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Product Information */}
      <div className="space-y-4 pt-4 border-t">
        <div>
          <h4 className="font-semibold mb-2 flex items-center">
            <Info className="h-4 w-4 mr-2" />
            Ingredients
          </h4>
          <p className="text-sm text-muted-foreground">{product.ingredients}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Nutritional Information</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between p-2 bg-muted/30 rounded">
              <span className="text-muted-foreground">Calories:</span>
              <span className="font-medium">{product.nutritionalInfo.calories}</span>
            </div>
            <div className="flex justify-between p-2 bg-muted/30 rounded">
              <span className="text-muted-foreground">Protein:</span>
              <span className="font-medium">{product.nutritionalInfo.protein}</span>
            </div>
            <div className="flex justify-between p-2 bg-muted/30 rounded">
              <span className="text-muted-foreground">Carbs:</span>
              <span className="font-medium">{product.nutritionalInfo.carbs}</span>
            </div>
            <div className="flex justify-between p-2 bg-muted/30 rounded">
              <span className="text-muted-foreground">Fat:</span>
              <span className="font-medium">{product.nutritionalInfo.fat}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <Button className="w-full" size="lg" onClick={handleConfirmOrder}>
        <Plus className="h-4 w-4 mr-2" />
        Confirm & Add to Order - ${calculatedPrice.toFixed(2)}
      </Button>
    </div>
  );
};

export default ProductDetails;
