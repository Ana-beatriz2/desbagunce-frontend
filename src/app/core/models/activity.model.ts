export type ActivityAction = 'purchased' | 'added_to_list' | 'restocked' | 'removed';

export interface Activity {
  id: string;
  userName: string;
  userAvatarUrl: string | null;
  action: ActivityAction;
  itemName: string;
  createdAt: string;
}
