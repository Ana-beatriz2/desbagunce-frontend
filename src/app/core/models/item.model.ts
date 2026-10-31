import { Tag } from './tag.model';

export type ItemStatus = 'ok' | 'low' | 'out';

export type ItemUnit = 'unit' | 'kg';

export interface Item {
  id: string;
  name: string;
  icon: string;
  imageUrl: string | null;
  unit: ItemUnit;
  quantity: number;
  restockThreshold: number;
  tags: Tag[];
  houseId: string;
}

export interface ItemStats {
  ok: number;
  low: number;
  out: number;
}

// Confirmed against the backend's CreateItemDto / ItemResponseDto — not a guess like the
// types above. Keep these in sync with src/modules/item/item.dto.ts in desbagunce-backend.
export const MAX_ITEM_QUANTITY = 9_999_999.999;
export const MAX_ITEM_QUANTITY_DECIMALS = 3;
export const MAX_ESTIMATED_DURATION_DAYS = 3650;

export type ItemApiStatus = 'in_stock' | 'running_low' | 'probably_out' | 'out_of_stock';

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
  status: ItemApiStatus;
  currentQuantity: number;
  dailyConsumption: number | null;
  estimatedDepletionDate: string | null;
  houseId: string;
}

export interface ItemQuery {
  search: string;
  tagId: string | null;
  attentionOnly: boolean;
  page: number;
  pageSize: number;
}

export function itemStatus(item: Item): ItemStatus {
  if (item.quantity <= 0) return 'out';
  if (item.quantity <= item.restockThreshold) return 'low';
  return 'ok';
}

export function unitLabel(unit: ItemUnit): string {
  return unit === 'kg' ? 'kg' : 'un';
}
