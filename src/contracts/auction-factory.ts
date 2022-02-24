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
    at: "secret182du2ls3wz30sta7yp03cpv8ppjfdl9rqmty74",
    definition: auctionFactoryDef
});

