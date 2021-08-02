export interface changeUidInterface {
  uid: number;
  user: string;
}

export interface generateInviteInterface {
  amount: number;
  user: string;
  expiresAt: number;
}

export interface botInterface {
  key: string;
}

export interface resolveUserInterface {
  user: string;
}