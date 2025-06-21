const fetchTokensAndNativeWalletData = require('../../../externals/abstractLayersForAPI/fetchWalletData/fetchTokensAndNativeWalletData');

jest.mock('moralis', () => ({
  default: {
    start: jest.fn(),
    EvmApi: {
      balance: {
        getNativeBalance: jest.fn()
      },
      token: {
        getWalletTokenBalances: jest.fn(),
        getWalletTokenTransfers: jest.fn()
      },
      transaction: {
        getWalletTransactions: jest.fn()
      }
    }
  }
}));

describe('fetchTokensAndNativeWalletData', () => {
  const address = '0xTestAddress';
  const chain = '0x1';
  const symbol = 'ETH';

  beforeEach(() => {
    jest.clearAllMocks();

    require('moralis').default.start.mockResolvedValue();

    require('moralis').default.EvmApi.balance.getNativeBalance.mockResolvedValue({
      raw: { balance: '1000000000000000000' }
    });

    require('moralis').default.EvmApi.token.getWalletTokenBalances.mockResolvedValue({
      raw: [
        { symbol: 'USDT', balance: '1000000', decimals: 6 }
      ]
    });

    require('moralis').default.EvmApi.transaction.getWalletTransactions.mockResolvedValue({
      raw: {
        result: [
          {
            hash: '0xabc',
            block_timestamp: '2025-06-10T10:00:00Z',
            from_address: address,
            value: '500000000000000000', // 0.5 ETH
            transaction_fee: '21000'
          }
        ]
      }
    });


    require('moralis').default.EvmApi.token.getWalletTokenTransfers.mockResolvedValue({
      raw: {
        result: [
          {
            transaction_hash: '0xdef',
            block_timestamp: '2025-06-10T11:00:00Z',
            from_address: '0xOther',
            to_address: address,
            value: '2000000', // 2 USDT
            token_symbol: 'USDT',
            decimal: 6
          }
        ]
      }
    });
  });

  it('returns balances and transactions in expected format', async () => {
    const result = await fetchTokensAndNativeWalletData(address, chain, symbol);

    expect(result).toEqual({
      chain: 'ethereum',
      balances: {
        nativeBalance: {
          symbol: 'ETH',
          balance: 1
        },
        tokens: [
          { symbol: 'USDT', balance: 1 }
        ]
      },
      transactions: [
        {
          txid: '0xdef',
          timestamp: '2025-06-10T11:00:00Z',
          type: 'receive',
          fee: 0,
          amount: 2,
          symbol: 'USDT',
          isNative: false
        },
        {
          txid: '0xabc',
          timestamp: '2025-06-10T10:00:00Z',
          type: 'send',
          fee: 21000,
          amount: 0.5,
          symbol: 'ETH',
          isNative: true
        }
      ]
    });
  });

  it('handles empty balances and transactions', async () => {
    require('moralis').default.EvmApi.balance.getNativeBalance.mockResolvedValue({
      raw: { balance: '0' }
    });
    require('moralis').default.EvmApi.token.getWalletTokenBalances.mockResolvedValue({
      raw: []
    });
    require('moralis').default.EvmApi.transaction.getWalletTransactions.mockResolvedValue({
      raw: { result: [] }
    });
    require('moralis').default.EvmApi.token.getWalletTokenTransfers.mockResolvedValue({
      raw: { result: [] }
    });

    const result = await fetchTokensAndNativeWalletData(address, chain, symbol);

    expect(result.balances.nativeBalance).toBeNull();
    expect(result.balances.tokens).toEqual([]);
    expect(result.transactions).toEqual([]);
  });

  it('throws error if Moralis fails', async () => {
    require('moralis').default.EvmApi.balance.getNativeBalance.mockRejectedValue(new Error('fail'));

    await expect(fetchTokensAndNativeWalletData(address, chain, symbol))
      .rejects
      .toThrow('Failed to fetch wallet balance: fail');
  });
});
