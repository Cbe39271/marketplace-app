import { Address, Event } from './Blockchain';

export interface Spigot {
  id: Address;
  creditLine: Address;
  settings: SpigotSetting[];
  events: Event[];
}

export interface SpigotSetting {
  ownerSplit: number;
  contract: Address;
  token: Address;
}
