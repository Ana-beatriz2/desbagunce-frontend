import { Tag } from './tag.model';

export type ItemUnit = 'unit' | 'kg';

export type ItemStatus = 'in_stock' | 'running_low' | 'probably_out' | 'out_of_stock';

export const ATTENTION_STATUSES: ItemStatus[] = ['running_low', 'probably_out', 'out_of_stock'];

export const MAX_ITEM_QUANTITY = 9_999_999.999;
export const MAX_ITEM_QUANTITY_DECIMALS = 3;
export const MAX_ESTIMATED_DURATION_DAYS = 3650;

export interface Item {
  id: string;
  name: string;
  photoPath: string | null;
  unit: ItemUnit;
  status: ItemStatus;
  currentQuantity: number;
  estimatedDepletionDate: string | null;
  tags: Tag[];
}

export interface ItemStats {
  inStock: number;
  runningLow: number;
  probablyOut: number;
  outOfStock: number;
}

export interface ItemQuery {
  search: string;
  tagIds: string[];
  status?: ItemStatus[];
  page: number;
  pageSize: number;
}

export interface CreateItemRequest {
  name: string;
  notes?: string;
  unit: ItemUnit;
  currentQuantity: number;
  estimatedDurationDays: number;
}

export interface ItemResponse {
  id: string;
  name: string;
  notes: string | null;
  photoPath: string | null;
  unit: ItemUnit;
  status: ItemStatus;
  currentQuantity: number;
  dailyConsumption: number | null;
  estimatedDepletionDate: string | null;
  houseId: string;
}

const DEFAULT_ICON = 'inventory_2';

// The backend has no icon column, so the card derives one from the item's tags.
const ICON_BY_TAG_NAME: Record<string, string> = {
  Limpeza: 'soap',
  Despensa: 'kitchen',
  Higiene: 'shower',
  Banheiro: 'bathroom',
  Cozinha: 'countertops',
  Grãos: 'rice_bowl',
  Bebidas: 'local_drink',
  Padaria: 'bakery_dining',
  Hortifruti: 'nutrition',
  Frios: 'icecream',
};

export function itemIcon(item: Item): string {
  for (const tag of item.tags) {
    const icon = ICON_BY_TAG_NAME[tag.name];
    if (icon) return icon;
  }
  return DEFAULT_ICON;
}

export function unitLabel(unit: ItemUnit): string {
  return unit === 'kg' ? 'kg' : 'un';
}
