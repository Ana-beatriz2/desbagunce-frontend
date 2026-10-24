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
