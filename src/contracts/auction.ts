export const auctionDef = {
    queries:  {
        getAuctionInfo(){
          return { auction_info: {} };
      },
        hasBids({ address} , viewing_key){
          return { has_bids: {address, viewing_key}}
      }
    },
    messages: {
      changeMinimumBid(_, amount){
        const handleMsg = {
          change_minimum_bid: {
            minimum_bid: amount
          }
        };
        return {handleMsg, fees:50000};
      }
    }
};