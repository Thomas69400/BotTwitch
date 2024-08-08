export interface Tags {
  id: string;
  'user-id': string;
  username: string;
  'badge-info'?: [] | null; // TODO à revoir j'avais que null
  badges?: { [id: string]: number };
  'client-nonce'?: string;
  color?: string;
  'display-name'?: string;
  emotesv?: string[] | null; // TODO à revoir j'avais que null
  'first-msg'?: boolean;
  flags?: [] | null; // TODO à revoir j'avais que null
  mod?: boolean;
  'returning-chatter'?: boolean;
  'room-id'?: string;
  subscriber?: boolean;
  'tmi-sent-ts'?: string;
  turbo?: boolean;
  'user-type'?: [] | null; // TODO à revoir j'avais que null
  'emotes-raw'?: [] | null; // TODO à revoir j'avais que null
  'badge-info-raw'?: [] | null; // TODO à revoir j'avais que null
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
