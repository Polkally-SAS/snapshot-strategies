import { BigNumberish } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import { Multicaller } from '../../utils';

export const author = 'polkally-sas';
export const version = '0.0.1';


const abi = [
  'function stakings(address) view returns (address account, uint256 tierId, uint256 amountLocked, uint256 createdAt)'
];

type StakeInfo = {
  account: string,
  tierId: number,
  amountLocked: BigNumberish,
  createdAt:number
}

export async function strategy(
  space,
  network,
  provider,
  addresses,
  options,
  snapshot
): Promise<Record<string, number>> {
  const blockTag = typeof snapshot === 'number' ? snapshot : 'latest';

  const multi = new Multicaller(network, provider, abi, { blockTag });
  addresses.forEach((address) =>
    multi.call(address, options.address, 'stakings', [address])
  );
  const result: Record<string, StakeInfo> = await multi.execute();

  return Object.fromEntries(
    Object.entries(result).map(([address, stakeInfo]) => [
      address,
      parseFloat(formatUnits(stakeInfo.amountLocked, options.decimals))
    ])
  );
}
