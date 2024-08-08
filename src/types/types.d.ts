// TODO à revoir avec les Tags de @Thomas69400
export interface Tags {
  id: string;
  'user-id': string;
  username: string;
  'badge-info'?: [] | null;
  badges?: { [id: string]: number };
  'client-nonce'?: string;
  color?: string;
  'display-name'?: string;
  emotesv?: string[] | null;
  'first-msg'?: boolean;
  flags?: [] | null;
  mod?: boolean;
  'returning-chatter'?: boolean;
  'room-id'?: string;
  subscriber?: boolean;
  'tmi-sent-ts'?: string;
  turbo?: boolean;
  'user-type'?: [] | null;
  'emotes-raw'?: [] | null;
  'badge-info-raw'?: [] | null;
  'badges-raw'?: string;
  'message-type'?: string;
}

export interface Viewer {
  id: string;
  name: string;
  points: number;
  lastActive: Date;
}

export type Viewers = {
  [id: string]: Viewer;
};

export type CooldownUser = {
  [id: string]: Date;
};

export interface RaffleEnjoyer {
  id: string;
  name: string;
}
