import cacheFetch from "@/libs/cache-fetch";
import MarketData from "@/libs/market-data";
import { Activity, ActivityStatus, ActivityType } from "@/types/activity";
import { BaseNetwork } from "@/types/base-network";
import { NetworkEndpoints, NetworkTtls } from "./configs";
import BigNumber from "bignumber.js";
import { formatFloatingPointValue } from "@/libs/utils/number-formatter";

const getAddressActivity = async (
  address: string,
  endpoint: string,
  ttl: number
): Promise<any[]> => {
  const url = `${endpoint}txs/account/${address}?limit=20&token=coin`;

  return cacheFetch({ url }, ttl)
    .then((res) => {
      return res ? res : [];
    })
    .catch((error) => {
      console.error("Failed to fetch activity:", error);
      return [];
    });
};

export default async (
  network: BaseNetwork,
  address: string
): Promise<Activity[]> => {
  const networkName = network.name as keyof typeof NetworkEndpoints;
  const enpoint = NetworkEndpoints[networkName];
  const ttl = NetworkTtls[networkName];

  const activities = await getAddressActivity(address, enpoint, ttl);

  let price = "0";

  if (network.coingeckoID) {
    const marketData = new MarketData();
    await marketData
      .getTokenPrice(network.coingeckoID)
      .then((mdata) => (price = mdata || "0"));
  }
  return activities
    .filter((a) => a.idx === 1) // idx === 0 is the gas fee activity
    .map((activity: any, i: number) => {
      const tt = {
        nonce: i.toString(),
        from: activity.fromAccount,
        to: activity.toAccount,
        isIncoming: activity.fromAccount !== address,
        network: network.name,
        rawInfo: activity,
        status: ActivityStatus.success,
        timestamp: new Date(activity.blockTime).getTime(),
        value: formatFloatingPointValue(new BigNumber(activity.amount)).value,
        transactionHash: activity.requestKey,
        type: ActivityType.transaction,
        token: {
          decimals: network.decimals,
          icon: network.icon,
          name: network.currencyNameLong,
          symbol:
            activity.token !== "coin" ? activity.token : network.currencyName,
          price: price,
        },
      };
      return tt;
    });
};