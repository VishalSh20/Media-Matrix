import prisma from "../../../db/prisma_client.js"

function isRetryableError(error) {
  return (
    error.code === 'P1001' || // Connection error
    error.code === 'P1002' || // Connection timed out
    error.code === 'P1008' || // Operations timed out
    error.code === 'P1017' || // Server closed the connection
    error.name === 'PrismaClientInitializationError' ||
    error.message?.includes('Connection refused')
  );
}

export async function withRetry(operation, options = {}) {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    exponentialBackoff = true
  } = options;

  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Check if error is retryable
      if (!isRetryableError(error) || attempt === maxAttempts) {
        throw error;
      }

      // Calculate delay with exponential backoff if enabled
      const delay = exponentialBackoff 
        ? delayMs * Math.pow(2, attempt - 1)
        : delayMs;

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

