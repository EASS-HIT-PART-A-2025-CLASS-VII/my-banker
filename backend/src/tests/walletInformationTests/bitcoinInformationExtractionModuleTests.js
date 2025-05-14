const axios = require('axios');
const extractBitcoinInformation = require('../../walletInformation/walletInformationModules/bitcoinInformationExtractionModule');

// Mock axios to simulate API responses
jest.mock('axios');

describe('Bitcoin Information Extraction Module', () => {
  const mockAddress = 'mockBitcoinAddress';

  describe('getBitcoinBalance', () => {
    it('should return the correct balance in BTC', async () => {
      // Mock the API response for balance
      axios.get.mockResolvedValueOnce({ data: '150000000' }); // 1.5 BTC in satoshis

      const balance = await extractBitcoinInformation.getBitcoinBalance(mockAddress);

      expect(balance).toBe(1.5); // Assert the balance is correctly converted to BTC
    });

    it('should throw an error if the API call fails', async () => {
      // Mock the API to throw an error
      axios.get.mockRejectedValueOnce(new Error('API Error'));

      await expect(extractBitcoinInformation.getBitcoinBalance(mockAddress)).rejects.toThrow(
        'Failed to fetch Bitcoin balance'
      );
    });
  });

  describe('getTransactions', () => {
    it('should return the correct transaction history', async () => {
      // Mock the API response for transactions
      axios.get.mockResolvedValueOnce({
        data: {
          txs: [
            {
              hash: 'txid1',
              time: 1672531200, // Unix timestamp
              inputs: [{ prev_out: { addr: 'senderAddress' } }],
              out: [{ addr: mockAddress, value: 50000000 }], // 0.5 BTC
            },
            {
              hash: 'txid2',
              time: 1672617600, // Unix timestamp
              inputs: [{ prev_out: { addr: mockAddress } }],
              out: [{ addr: 'receiverAddress', value: 20000000 }], // 0.2 BTC
            },
          ],
        },
      });

      const transactions = await extractBitcoinInformation.getTransactions(mockAddress);

      expect(transactions).toEqual([
        {
          txid: 'txid1',
          time: 1672531200,
          inputs: [{ prev_out: { addr: 'senderAddress' } }],
          outputs: [{ addr: mockAddress, value: 50000000 }],
        },
        {
          txid: 'txid2',
          time: 1672617600,
          inputs: [{ prev_out: { addr: mockAddress } }],
          outputs: [{ addr: 'receiverAddress', value: 20000000 }],
        },
      ]);
    });

    it('should return an empty array if no transactions are found', async () => {
      // Mock the API response with no transactions
      axios.get.mockResolvedValueOnce({ data: { txs: [] } });

      const transactions = await extractBitcoinInformation.getTransactions(mockAddress);

      expect(transactions).toEqual([]);
    });

    it('should throw an error if the API call fails', async () => {
      // Mock the API to throw an error
      axios.get.mockRejectedValueOnce(new Error('API Error'));

      await expect(extractBitcoinInformation.getTransactions(mockAddress)).rejects.toThrow(
        'Failed to fetch Bitcoin transactions'
      );
    });
  });

  describe('extractBitcoinInformation', () => {
    it('should return the correct wallet information', async () => {
      // Mock the API responses for balance and transactions
      axios.get
        .mockResolvedValueOnce({ data: '150000000' }) // 1.5 BTC in satoshis
        .mockResolvedValueOnce({
          data: {
            txs: [
              {
                hash: 'txid1',
                time: 1672531200,
                inputs: [{ prev_out: { addr: 'senderAddress' } }],
                out: [{ addr: mockAddress, value: 50000000 }], // 0.5 BTC
              },
              {
                hash: 'txid2',
                time: 1672617600,
                inputs: [{ prev_out: { addr: mockAddress } }],
                out: [{ addr: 'receiverAddress', value: 20000000 }], // 0.2 BTC
              },
            ],
          },
        });

      const walletInfo = await extractBitcoinInformation(mockAddress);

      expect(walletInfo).toEqual({
        coin: 'BTC',
        balance: 1.5,
        transactions: [
          {
            txid: 'txid1',
            timestamp: '2023-01-01T00:00:00.000Z',
            type: 'receive',
            amount: 0.5,
            from: 'senderAddress',
            to: mockAddress,
            fee: 0,
            status: 'confirmed',
          },
          {
            txid: 'txid2',
            timestamp: '2023-01-02T00:00:00.000Z',
            type: 'send',
            amount: 0.2,
            from: mockAddress,
            to: 'receiverAddress',
            fee: 0,
            status: 'confirmed',
          },
        ],
      });
    });

    it('should throw an error if fetching wallet information fails', async () => {
      // Mock the API to throw an error
      axios.get.mockRejectedValueOnce(new Error('API Error'));

      await expect(extractBitcoinInformation(mockAddress)).rejects.toThrow(
        'Failed to extract Bitcoin wallet information'
      );
    });
  });
});