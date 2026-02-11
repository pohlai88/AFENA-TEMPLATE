export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { flushLogger } = await import('afena-logger');

    // Flush buffered Pino logs on graceful shutdown to prevent data loss
    process.on('beforeExit', () => {
      flushLogger();
    });

    process.on('SIGTERM', () => {
      flushLogger();
    });

    process.on('SIGINT', () => {
      flushLogger();
    });
  }
}
