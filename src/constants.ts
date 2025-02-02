export const USDC_RANGER_POOL_ID = "USDC-Ranger-Pool";
export const USDC_WBNB_PANCAKE_POOL_ID = "USDC-WBNB-Pool";
export const POOLS = {
   [USDC_RANGER_POOL_ID]: {
       chainId: "56",
       targets: [
           {
               id: USDC_WBNB_PANCAKE_POOL_ID,
               percent: 100,
           }
       ]
   }
};
