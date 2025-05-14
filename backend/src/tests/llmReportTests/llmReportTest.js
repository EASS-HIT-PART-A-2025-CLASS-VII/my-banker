const axios = require('axios');
const analyzeReportWithLLM = require('../../../backend/llmReport/llmReport');

// Mock axios
jest.mock('axios');

describe('analyzeReportWithLLM', () => {
  const mockReport = {
    holdings: [
      { asset: 'BTC', amount: 1.5, valueUSD: 40000 },
      { asset: 'ETH', amount: 10, valueUSD: 20000 }
    ],
    realizedGains: 5000,
    realizedLosses: 2000
  };

  it('should return trimmed LLM response text on success', async () => {
    const mockLLMResponse = {
      data: {
        response: '  This is a formal analysis paragraph.  '
      }
    };

    axios.post.mockResolvedValue(mockLLMResponse);

    const result = await analyzeReportWithLLM(mockReport);

    expect(result).toBe('This is a formal analysis paragraph.');
    expect(axios.post).toHaveBeenCalledWith(
      'http://ollama:11434/api/generate',
      expect.objectContaining({
        model: 'tinyllama',
        prompt: expect.stringContaining('You are a private banker'),
        stream: false
      }),
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json'
        }
      })
    );
  });

  it('should throw an error if axios request fails', async () => {
    axios.post.mockRejectedValue(new Error('Connection refused'));

    await expect(analyzeReportWithLLM(mockReport)).rejects.toThrow('Request to Ollama failed: Connection refused');
  });
});
