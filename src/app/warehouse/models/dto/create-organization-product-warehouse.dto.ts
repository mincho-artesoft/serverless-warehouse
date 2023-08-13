import { IIngredient } from "../ingredient.interface";

export interface CreateOrganizationProductWarehouseDto {
  name: Array<{ key: string; value: string }>;
  brand_name: string;
  description: Array<{ key: string; value: string }>;
  organizationId: string;
  unit: string;
  tags?: string[];
  price: number;
  ingredients?: IIngredient[];
}