const axios = require('axios');

jest.mock('axios');

const mockWeb3 = {
  eth: { getBalance: jest.fn() },
  utils: { fromWei: jest.fn() }
};

jest.mock('web3', () => ({
  Web3: jest.fn(() => mockWeb3)
}));

const { Web3 } = require('web3');
const fetchEthereumWalletData = require('../../../externals/abstractLayersForAPI/fetchWalletData/fetchEthereumWalletData');

describe('Ethereum Wallet Data Functions', () => {
  beforeEach(() => {
    Web3.mockClear();
    mockWeb3.eth.getBalance.mockResolvedValue('2000000000000000000');

    mockWeb3.utils.fromWei.mockImplementation((val) => {
      if (val === '2000000000000000000') return '2.0';
      if (val === '1000000000000000000') return '1.0';
      const expectedFee = (BigInt(21000) * BigInt(20000000000)).toString();
      if (val === expectedFee) return '0.00042';
      return '0';
    });
  });

  it('should aggregate wallet data correctly', async () => {
    axios.get.mockResolvedValue({
      data: {
        status: '1',
        result: [{
          hash: '0xtx1',
          timeStamp: String(Math.floor(Date.now()/1000) - 1000),
          from: '0xAnotherAddress',
          to: '0xTestAddress',
          value: '1000000000000000000',
          gasUsed: '21000',
          gasPrice: '20000000000',
          isError: '0'
        }]
      }
    });

    const walletData = await fetchEthereumWalletData('0xTestAddress');

    expect(walletData.balance).toBe(2.0);
  });
});