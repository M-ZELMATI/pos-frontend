'use client';
import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Info, Plus, X, Search } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';

// Define types for nested structures
interface ProductImage {
  id: number;
  uuid: string;
  url: string;
}

interface ProductSize {
  name: string;
  priceModifier: number;
}

interface ProductTemperature {
  name: string;
  priceModifier: number;
}

interface NutritionalInfo {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

interface Product {
  id: number;
  title: string;
  basePrice: number;
  currency: string;
  description: string;
  category: string;
  images: ProductImage[];
  sizes: ProductSize[];
  temperatures: ProductTemperature[];
  nutritionalInfo: NutritionalInfo;
  ingredients: string;
}

const DEFAULT_IMAGE =
  'https://cdn-websites.autodealersdigital.com/common/images/car_not_found.webp';

// Mock Product Data with Full Structure
const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Caffe Latte',
    basePrice: 4.0,
    currency: 'USD',
    description: 'Rich espresso with steamed milk and a light layer of foam',
    category: 'Coffee',
    images: [
      {
        id: 1,
        uuid: 'img-1',
        url: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=800&h=600&fit=crop',
      },
      {
        id: 2,
        uuid: 'img-2',
        url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&h=600&fit=crop',
      },
    ],
    sizes: [
      { name: 'S', priceModifier: -0.5 },
      { name: 'M', priceModifier: 0 },
      { name: 'L', priceModifier: 0.5 },
    ],
    temperatures: [
      { name: 'Hot', priceModifier: 0 },
      { name: 'Iced', priceModifier: 0.5 },
    ],
    nutritionalInfo: { calories: '190 kcal', protein: '9g', carbs: '18g', fat: '7g' },
    ingredients: 'Espresso, Whole Milk, Foam',
  },
  {
    id: 2,
    title: 'Cappuccino',
    basePrice: 4.5,
    currency: 'USD',
    description: 'Espresso with equal parts steamed milk and rich foam',
    category: 'Coffee',
    images: [
      {
        id: 3,
        uuid: 'img-3',
        url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&h=600&fit=crop',
      },
    ],
    sizes: [
      { name: 'S', priceModifier: -0.5 },
      { name: 'M', priceModifier: 0 },
      { name: 'L', priceModifier: 0.5 },
    ],
    temperatures: [
      { name: 'Hot', priceModifier: 0 },
      { name: 'Iced', priceModifier: 0.5 },
    ],
    nutritionalInfo: { calories: '120 kcal', protein: '6g', carbs: '12g', fat: '6g' },
    ingredients: 'Espresso, Steamed Milk, Milk Foam',
  },
  {
    id: 3,
    title: 'Americano',
    basePrice: 3.5,
    currency: 'USD',
    description: 'Espresso shots diluted with hot water for a smooth finish',
    category: 'Coffee',
    images: [
      {
        id: 4,
        uuid: 'img-4',
        url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=600&fit=crop',
      },
    ],
    sizes: [
      { name: 'S', priceModifier: -0.5 },
      { name: 'M', priceModifier: 0 },
      { name: 'L', priceModifier: 0.5 },
    ],
    temperatures: [
      { name: 'Hot', priceModifier: 0 },
      { name: 'Iced', priceModifier: 0.5 },
    ],
    nutritionalInfo: { calories: '15 kcal', protein: '1g', carbs: '3g', fat: '0g' },
    ingredients: 'Espresso, Water',
  },
  {
    id: 4,
    title: 'Green Tea Latte',
    basePrice: 4.75,
    currency: 'USD',
    description: 'Premium matcha green tea blended with steamed milk',
    category: 'Tea',
    images: [
      {
        id: 5,
        uuid: 'img-5',
        url: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=800&h=600&fit=crop',
      },
    ],
    sizes: [
      { name: 'S', priceModifier: -0.5 },
      { name: 'M', priceModifier: 0 },
      { name: 'L', priceModifier: 0.5 },
    ],
    temperatures: [
      { name: 'Hot', priceModifier: 0 },
      { name: 'Iced', priceModifier: 0.5 },
    ],
    nutritionalInfo: { calories: '240 kcal', protein: '10g', carbs: '37g', fat: '7g' },
    ingredients: 'Matcha Powder, Milk, Sugar',
  },
  {
    id: 5,
    title: 'Earl Grey Tea',
    basePrice: 3.25,
    currency: 'USD',
    description: 'Classic black tea infused with bergamot oil',
    category: 'Tea',
    images: [
      {
        id: 6,
        uuid: 'img-6',
        url: 'https://images.unsplash.com/photo-1597318112874-b04c0ac1d0c6?w=800&h=600&fit=crop',
      },
    ],
    sizes: [
      { name: 'S', priceModifier: -0.3 },
      { name: 'M', priceModifier: 0 },
      { name: 'L', priceModifier: 0.3 },
    ],
    temperatures: [
      { name: 'Hot', priceModifier: 0 },
      { name: 'Iced', priceModifier: 0 },
    ],
    nutritionalInfo: { calories: '2 kcal', protein: '0g', carbs: '0g', fat: '0g' },
    ingredients: 'Black Tea, Bergamot Oil',
  },
  {
    id: 6,
    title: 'Chocolate Croissant',
    basePrice: 3.95,
    currency: 'USD',
    description: 'Buttery croissant filled with premium dark chocolate',
    category: 'Pastries',
    images: [
      {
        id: 7,
        uuid: 'img-7',
        url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=600&fit=crop',
      },
    ],
    sizes: [],
    temperatures: [],
    nutritionalInfo: { calories: '350 kcal', protein: '6g', carbs: '42g', fat: '18g' },
    ingredients: 'Flour, Butter, Chocolate, Sugar, Eggs',
  },
  {
    id: 7,
    title: 'Blueberry Muffin',
    basePrice: 3.5,
    currency: 'USD',
    description: 'Freshly baked muffin loaded with juicy blueberries',
    category: 'Pastries',
    images: [
      {
        id: 8,
        uuid: 'img-8',
        url: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=800&h=600&fit=crop',
      },
    ],
    sizes: [],
    temperatures: [],
    nutritionalInfo: { calories: '380 kcal', protein: '5g', carbs: '54g', fat: '16g' },
    ingredients: 'Flour, Blueberries, Sugar, Eggs, Butter',
  },
  {
    id: 8,
    title: 'Avocado Toast',
    basePrice: 6.95,
    currency: 'USD',
    description: 'Smashed avocado on artisan sourdough with cherry tomatoes',
    category: 'Sandwiches',
    images: [
      {
        id: 9,
        uuid: 'img-9',
        url: 'https://images.unsplash.com/photo-1603046891726-36bfd957009d?w=800&h=600&fit=crop',
      },
    ],
    sizes: [],
    temperatures: [],
    nutritionalInfo: { calories: '320 kcal', protein: '8g', carbs: '28g', fat: '22g' },
    ingredients: 'Avocado, Sourdough Bread, Cherry Tomatoes, Olive Oil, Salt, Pepper',
  },
  {
    id: 9,
    title: 'Turkey Club Sandwich',
    basePrice: 8.95,
    currency: 'USD',
    description: 'Triple-decker with turkey, bacon, lettuce, and tomato',
    category: 'Sandwiches',
    images: [
      {
        id: 10,
        uuid: 'img-10',
        url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&h=600&fit=crop',
      },
    ],
    sizes: [],
    temperatures: [],
    nutritionalInfo: { calories: '580 kcal', protein: '32g', carbs: '45g', fat: '28g' },
    ingredients: 'Turkey, Bacon, Lettuce, Tomato, Mayo, Bread',
  },
];

// Gooey Filter Component
const GooeyFilter = ({ id, strength = 15 }: { id: string; strength?: number }) => (
  <svg style={{ position: 'absolute', width: 0, height: 0 }}>
    <defs>
      <filter id={id} colorInterpolationFilters="sRGB">
        <feGaussianBlur in="SourceGraphic" stdDeviation={strength} result="blur" />
        <feColorMatrix
          in="blur"
          mode="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
          result="gooey"
        />
        <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
      </filter>
    </defs>
  </svg>
);

// Product Details Modal
const ProductDetailsModal = ({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) => {
  const [selectedSize, setSelectedSize] = useState(product?.sizes[1]?.name || '');
  const [selectedTemp, setSelectedTemp] = useState(product?.temperatures[0]?.name || '');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  const sizeModifier = product.sizes.find((s) => s.name === selectedSize)?.priceModifier || 0;
  const tempModifier =
    product.temperatures.find((t) => t.name === selectedTemp)?.priceModifier || 0;
  const finalPrice = product.basePrice + sizeModifier + tempModifier;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold">{product.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          {/* Image Gallery */}
          <div className="relative mb-4">
            <img
              src={product.images[currentImageIndex]?.url || DEFAULT_IMAGE}
              alt={product.title}
              className="w-full h-64 object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== DEFAULT_IMAGE) {
                  target.src = DEFAULT_IMAGE;
                }
              }}
            />
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      idx === currentImageIndex ? 'border-black' : 'border-gray-200'
                    }`}
                  >
                    <img 
                      src={img.url} 
                      alt="" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== DEFAULT_IMAGE) {
                          target.src = DEFAULT_IMAGE;
                        }
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-medium mb-3">
            {product.category}
          </div>
          <p className="text-gray-700 mb-4">{product.description}</p>

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Size</h3>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.name}
                    onClick={() => setSelectedSize(size.name)}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      selectedSize === size.name
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Temperature */}
          {product.temperatures.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Temperature</h3>
              <div className="flex gap-2">
                {product.temperatures.map((temp) => (
                  <button
                    key={temp.name}
                    onClick={() => setSelectedTemp(temp.name)}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      selectedTemp === temp.name
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {temp.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nutritional Info */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Nutritional Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Calories: {product.nutritionalInfo.calories}</div>
              <div>Protein: {product.nutritionalInfo.protein}</div>
              <div>Carbs: {product.nutritionalInfo.carbs}</div>
              <div>Fat: {product.nutritionalInfo.fat}</div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Ingredients</h3>
            <p className="text-sm text-gray-600">{product.ingredients}</p>
          </div>

          <div className="text-3xl font-bold mb-4">${finalPrice.toFixed(2)}</div>
          <Button className="w-full" size="lg">
            Add to Order
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function GooeyProductTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const [isGooeyEnabled, setIsGooeyEnabled] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const CATEGORIES = ['All', 'Coffee', 'Tea', 'Pastries', 'Sandwiches'];

  // Filter products based on active tab and search query
  const filteredProducts = useMemo(() => {
    let products = MOCK_PRODUCTS;

    // Filter by category
    if (activeTab !== 0) {
      products = products.filter((p) => p.category === CATEGORIES[activeTab]);
    }

    // Filter by search query (name and description)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      products = products.filter(
        (p) => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
      );
    }

    return products;
  }, [activeTab, searchQuery]);

  return (
    <div className="relative w-full min-h-screen flex justify-center p-8 bg-white">
      <GooeyFilter id="gooey-filter" strength={15} />

      <Button
        variant="outline"
        onClick={() => setIsGooeyEnabled(!isGooeyEnabled)}
        className="absolute top-4 left-4 z-20"
      >
        {isGooeyEnabled ? 'Disable Filter' : 'Enable Filter'}
      </Button>

      <div className="w-full max-w-6xl relative mt-24">
        <div
          className="absolute inset-0"
          style={{ filter: isGooeyEnabled ? 'url(#gooey-filter)' : 'none' }}
        >
          {/* Tab Headers */}
          <div className="flex w-full">
            {CATEGORIES.map((_, index) => (
              <div key={index} className="relative flex-1 h-12">
                {activeTab === index && (
                  <div className="absolute inset-0 bg-gray-100 transition-all duration-400" />
                )}
              </div>
            ))}
          </div>

          {/* Content Panel */}
          <div className="w-full min-h-[400px] bg-gray-100 p-8">
            {/* Search Bar */}
            <div className="mb-6 relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No products found matching your search.
              </div>
            )}
          </div>
        </div>

        {/* Interactive Tab Buttons */}
        <div className="relative flex w-full">
          {CATEGORIES.map((category, index) => (
            <button key={index} onClick={() => setActiveTab(index)} className="flex-1 h-12">
              <span
                className={`w-full h-full flex items-center justify-center font-semibold transition-colors ${
                  activeTab === index ? 'text-black' : 'text-gray-500'
                }`}
              >
                {category}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}
