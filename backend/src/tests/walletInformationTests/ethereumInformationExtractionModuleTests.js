const axios = require('axios');
const Web3 = require('web3');
const extractEthereumInformation = require('../../walletInformation/walletInformationModules/ethereumInformationExtractionModule');

// Mock axios and Web3 to simulate API responses
jest.mock('axios');
jest.mock('web3', () => {
  const mockWeb3 = jest.fn().mockImplementation(() => ({
    eth: {
      getBalance: jest.fn(),
    },
    utils: {
      fromWei: jest.fn(),
    },
  }));
  return mockWeb3;
});

describe('Ethereum Information Extraction Module', () => {
  const mockAddress = '0xMockEthereumAddress';
  const mockWeb3 = new Web3();

  describe('getEthereumBalance', () => {
    it('should return the correct balance in ETH', async () => {
      // Mock Web3's getBalance and fromWei methods
      mockWeb3.eth.getBalance.mockResolvedValueOnce('1500000000000000000'); // 1.5 ETH in Wei
      mockWeb3.utils.fromWei.mockReturnValueOnce('1.5');

      const balance = await extractEthereumInformation.getEthereumBalance(mockAddress);

      expect(balance).toBe(1.5); // Assert the balance is correctly converted to ETH
    });

    it('should throw an error if the Web3 call fails', async () => {
      // Mock Web3's getBalance to throw an error
      mockWeb3.eth.getBalance.mockRejectedValueOnce(new Error('Web3 Error'));

      await expect(extractEthereumInformation.getEthereumBalance(mockAddress)).rejects.toThrow(
        'Failed to fetch Ethereum balance'
      );
    });
  });

  describe('getEthereumTransactions', () => {
    it('should return the correct transaction history', async () => {
      // Mock the API response for transactions
      axios.get.mockResolvedValueOnce({
        data: {
          result: [
            {
              hash: 'txid1',
              timeStamp: '1672531200', // Unix timestamp
              to: mockAddress,
              from: '0xSenderAddress',
              value: '500000000000000000', // 0.5 ETH in Wei
              gasUsed: '21000',
              gasPrice: '1000000000', // 1 Gwei
              isError: '0',
            },
            {
              hash: 'txid2',
              timeStamp: '1672617600', // Unix timestamp
              to: '0xReceiverAddress',
              from: mockAddress,
              value: '200000000000000000', // 0.2 ETH in Wei
              gasUsed: '21000',
              gasPrice: '1000000000', // 1 Gwei
              isError: '0',
            },
          ],
        },
      });

      const transactions = await extractEthereumInformation.getEthereumTransactions(mockAddress);

      expect(transactions).toEqual([
        {
          txid: 'txid1',
          timestamp: '2023-01-01T00:00:00.000Z',
          type: 'receive',
          amount: '0.5',
          from: '0xSenderAddress',
          to: mockAddress,
          fee: '0.000021',
          status: 'confirmed',
        },
        {
          txid: 'txid2',
          timestamp: '2023-01-02T00:00:00.000Z',
          type: 'send',
          amount: '0.2',
          from: mockAddress,
          to: '0xReceiverAddress',
          fee: '0.000021',
          status: 'confirmed',
        },
      ]);
    });

    it('should return an empty array if no transactions are found', async () => {
      // Mock the API response with no transactions
      axios.get.mockResolvedValueOnce({ data: { result: [] } });

      const transactions = await extractEthereumInformation.getEthereumTransactions(mockAddress);

      expect(transactions).toEqual([]);
    });

    it('should throw an error if the API call fails', async () => {
      // Mock the API to throw an error
      axios.get.mockRejectedValueOnce(new Error('API Error'));

      await expect(extractEthereumInformation.getEthereumTransactions(mockAddress)).rejects.toThrow(
        'Failed to fetch Ethereum transactions'
      );
    });
  });

  describe('extractEthereumInformation', () => {
    it('should return the correct wallet information', async () => {
      // Mock Web3's getBalance and fromWei methods
      mockWeb3.eth.getBalance.mockResolvedValueOnce('1500000000000000000'); // 1.5 ETH in Wei
      mockWeb3.utils.fromWei.mockReturnValueOnce('1.5');

      // Mock the API response for transactions
      axios.get.mockResolvedValueOnce({
        data: {
          result: [
            {
              hash: 'txid1',
              timeStamp: '1672531200',
              to: mockAddress,
              from: '0xSenderAddress',
              value: '500000000000000000',
              gasUsed: '21000',
              gasPrice: '1000000000',
              isError: '0',
            },
          ],
        },
      });

      const walletInfo = await extractEthereumInformation(mockAddress);

      expect(walletInfo).toEqual({
        coin: 'ETH',
        balance: 1.5,
        transactions: [
          {
            txid: 'txid1',
            timestamp: '2023-01-01T00:00:00.000Z',
            type: 'receive',
            amount: '0.5',
            from: '0xSenderAddress',
            to: mockAddress,
            fee: '0.000021',
            status: 'confirmed',
          },
        ],
      });
    });

    it('should return null if fetching wallet information fails', async () => {
      // Mock Web3's getBalance to throw an error
      mockWeb3.eth.getBalance.mockRejectedValueOnce(new Error('Web3 Error'));

      const walletInfo = await extractEthereumInformation(mockAddress);

      expect(walletInfo).toBeNull();
    });
  });
});