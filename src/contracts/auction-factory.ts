import {
    createContract,
    ContractQueryRequest
  } from '@stakeordie/griptape.js';
import type { AuctionFactory } from './types';
import { v4 as uuidv4} from 'uuid';

function getCodeHash(address) {
  if (address === 'secret18vd8fpwxzck93qlwghaj6arh4p7c5n8978vsyg')
    return '9587d60b8e6b078ace12014ceeee089530b9fabcd76535d93666a6c127ad8813'
  return 'cd306596d0c5f43d99b7085c35be615dd2210c0a36bddfb4189b6a54d0906d95'
}


const auctionFactoryDef = {
    queries:  {
        listActiveAuctions(): ContractQueryRequest {
          return { list_active_auctions: {} };
      }
    },
    messages: {
      createViewingKey({ entropy }) {
        const handleMsg = {
          create_viewing_key: {
            entropy
          }
        };
        return {handleMsg};
      },
      createAuction(_, form) {
        const label = uuidv4();
        const sellTokenCodeHash = getCodeHash(form.sellContract);
        const bidTokenCodeHash = getCodeHash(form.bidContract);
        const handleMsg = {
          create_auction: {
            label,
            sell_contract: {
              address: form.sellContract,
              code_hash: sellTokenCodeHash
            },
            bid_contract: {
              address: form.bidContract,
              code_hash: bidTokenCodeHash
            },
            sell_amount: form.sellAmount,
            minimum_bid: form.minimumBid,
            ends_at: form.endsAt,
            description: form.description
          }
        };
        return {handleMsg};
      }
    }
}

export const auctionFactory = createContract<AuctionFactory>({
    id: "auction-Factory",
    at: "secret1efgmrzljrrfghhlu9t3tcxhnhlyfsz08qzjkxm",
    definition: auctionFactoryDef
});

