const mongoose = require('mongoose');
const connectDB = require('../../backend/database/db');

jest.mock('mongoose'); // Mock the mongoose library

describe('connectDB', () => {
  it('should log success message when connection is successful', async () => {
    // Mock mongoose.connect to simulate a successful connection
    mongoose.connect.mockResolvedValueOnce();

    // Mock console.log to capture the success message
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    await connectDB();

    // Assert that mongoose.connect was called with the correct arguments
    expect(mongoose.connect).toHaveBeenCalledWith(
      process.env.MONGO_URI || 'mongodb://localhost:27017/mybanker',
      { useNewUrlParser: true, useUnifiedTopology: true }
    );

    // Assert that the success message was logged
    expect(consoleLogSpy).toHaveBeenCalledWith('Connected to MongoDB');

    // Restore the original console.log implementation
    consoleLogSpy.mockRestore();
  });

  it('should log error and exit process when connection fails', async () => {
    // Mock mongoose.connect to simulate a connection failure
    const errorMessage = 'Connection failed';
    mongoose.connect.mockRejectedValueOnce(new Error(errorMessage));

    // Mock console.error to capture the error message
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Mock process.exit to prevent the test from exiting
    const processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});

    await connectDB();

    // Assert that mongoose.connect was called
    expect(mongoose.connect).toHaveBeenCalled();

    // Assert that the error message was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to connect to MongoDB',
      expect.any(Error)
    );

    // Assert that process.exit was called with code 1
    expect(processExitSpy).toHaveBeenCalledWith(1);

    // Restore the original implementations
    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });
});