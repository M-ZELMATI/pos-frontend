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
  
  export interface Product {
    title: string;
    basePrice: number;
    currency: string;
    description: string;
    images: ProductImage[];
    sizes: ProductSize[];
    temperatures: ProductTemperature[];
    nutritionalInfo: NutritionalInfo;
    ingredients: string;
  }
  export const DEFAULT_IMAGE =
  'https://cdn-websites.autodealersdigital.com/common/images/car_not_found.webp';

  // Type the product variable
  export const productExample: Product = {
    title: 'Caffe Latte Caffe Latte Caffe Latte Caffe Latte Caffe Latte Caffe Latte Caffe Latte Caffe Latte',
    basePrice: 4.0,
    currency: 'USD',
    description: 'Rich espresso with steamed milk, Rich espresso with steamed milk, Rich espresso with steamed milk, Rich espresso with steamed milk, Rich espresso with steamed milk, Rich espresso with steamed milk',
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
      {
        id: 3,
        uuid: 'img-3',
        url: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&h=600&fit=crop',
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
    nutritionalInfo: {
      calories: '190 kcal',
      protein: '9g',
      carbs: '18g',
      fat: '7g',
    },
    ingredients: 'Espresso, Whole Milk, Foam',
  };
  