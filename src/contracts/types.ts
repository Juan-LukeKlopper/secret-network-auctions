export interface Auction{
    address: string;
    label:string;
    pair:string;
    sell_amount:string;
    sell_decimals: number;
    minimum_bid:string;
    bid_decimals: number;
    ends_at: number;
}
  
export interface ActiveAuctionListInfo{
    list_active_auctions: {
        active: Auction[];
    }
}
  
export interface AuctionFactory{
    listActiveAuctions() : Promise< ActiveAuctionListInfo>;
}