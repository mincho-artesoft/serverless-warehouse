
interface CurrentProduct {
  quantity: number;
  expirationDate: {
    value: Date;
  };
}
interface Ingredient {
  quantity: number;
  productId: string;
}

// Define the main interface for the "warehouseSchema"
export interface CreateWarehouseDto {
  id: string;
  name: Array<{ key: string; value: string }>;
  brand_name: string;
  description: Array<{ key: string; value: string }>;
  organizationId: string;
  unit: string;
  quantity: number;
  tags: string[];
  price: number;
  currentProducts: CurrentProduct[];
  ingredients: Ingredient[];
  createdAt: {
    created_at: {
      value: Date;
      settings: {
        storage: 'iso';
      };
    };
  };
  updatedAt: {
    updated_at: {
      value: Date;
      settings: {
        storage: 'iso';
      };
    };
  };
}