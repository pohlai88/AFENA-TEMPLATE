import { NextRequest, NextResponse } from 'next/server';
import { createRequestLogger, logError, logPerformance } from 'afena-logger';
import logger from '@/lib/logger';

export async function GET(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') || 'unknown';
  const requestLogger = createRequestLogger(logger, {
    requestId,
    method: 'GET',
    url: request.url,
  });

  try {
    requestLogger.info('Processing GET request');

    // Simulate some work
    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, 100));
    const duration = Date.now() - startTime;

    logPerformance(requestLogger, 'api-example-get', duration, {
      requestId,
    });

    const data = {
      message: 'Hello from API with structured logging!',
      timestamp: new Date().toISOString(),
      requestId,
    };

    requestLogger.info({ data }, 'GET request completed successfully');

    return NextResponse.json(data);
  } catch (error) {
    logError(requestLogger, error as Error, { requestId });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') || 'unknown';
  const requestLogger = createRequestLogger(logger, {
    requestId,
    method: 'POST',
    url: request.url,
  });

  try {
    const body = await request.json();
    
    requestLogger.debug({ body }, 'Received POST request body');

    // Validate input
    if (!body.name) {
      requestLogger.warn({ body }, 'Missing required field: name');
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Process the request
    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, 50));
    const duration = Date.now() - startTime;

    logPerformance(requestLogger, 'api-example-post', duration, {
      requestId,
      inputName: body.name,
    });

    const response = {
      message: `Hello, ${body.name}!`,
      timestamp: new Date().toISOString(),
      requestId,
    };

    requestLogger.info({ response }, 'POST request completed successfully');

    return NextResponse.json(response);
  } catch (error) {
    logError(requestLogger, error as Error, { requestId });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
