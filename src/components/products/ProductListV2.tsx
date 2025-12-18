import { mockProducts } from "@/data/mockProducts";
import { ProductTable } from "./ProductTable";
import { ProductDetailV2 } from "./ProductDetailV2";
import { useAppStore } from "@/store/useAppStore";

export const ProductListV2 = () => {
  const { selectedProductId, setSelectedProductId } = useAppStore();

  const selectedProduct = mockProducts.find((p) => p.id === selectedProductId);

  if (selectedProduct) {
    return (
      <ProductDetailV2
        product={selectedProduct}
        onBack={() => setSelectedProductId(null)}
      />
    );
  }

  return <ProductTable />;
};
