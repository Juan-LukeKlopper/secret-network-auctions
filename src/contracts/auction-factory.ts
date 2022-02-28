import {
    createContract,
    ContractQueryRequest
  } from '@stakeordie/griptape.js';
import type { AuctionFactory } from './types';

const auctionFactoryDef = {
    queries:  {
        listActiveAuctions(): ContractQueryRequest {
          return { list_active_auctions: {} };
      }
    }
}

export const auctionFactory = createContract<AuctionFactory>({
    id: "auction-Factory",
    at: "secret1efgmrzljrrfghhlu9t3tcxhnhlyfsz08qzjkxm",
    definition: auctionFactoryDef
});

