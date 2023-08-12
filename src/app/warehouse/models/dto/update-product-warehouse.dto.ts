
import { IIngredient } from "../ingredient.interface";

export interface UpdateProductWarehouseDto {
  name: Array<{ key: string; value: string }>;
  organizationId: string;
  brand_name: string;
  description: Array<{ key: string; value: string }>;
  unit: string;
  tags: string[];
  price: number;
}