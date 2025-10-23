import ProductCard from '@/components/products/ProductCard';
import { productExample } from '@/types/product/product';
import React from 'react';

const page = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full h-full">
      <div className="flex flex-wrap gap-4 justify-center h-full w-full mt-50">
        <ProductCard product={productExample} />
      </div>
    </div>
  );
};

export default page;
