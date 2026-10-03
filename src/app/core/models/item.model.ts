export type ItemStatus = 'ok' | 'low' | 'out';

export interface Item {
  id: string;
  name: string;
  icon: string;
  quantity: number;
  restockThreshold: number;
  houseId: string;
}

export interface ItemStats {
  ok: number;
  low: number;
  out: number;
}

export function itemStatus(item: Item): ItemStatus {
  if (item.quantity <= 0) return 'out';
  if (item.quantity <= item.restockThreshold) return 'low';
  return 'ok';
}
