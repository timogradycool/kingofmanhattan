import type { SeedBundle } from '../types';
import { config } from './config';
import { team } from './team';
import { clients } from './clients';

export const seed: SeedBundle = { config, team, clients };
export { config, team, clients };
