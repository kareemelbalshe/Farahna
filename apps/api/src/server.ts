import app from './app';
import { ENV } from './config/env';
import { prisma } from './config/db';

async function bootstrap() {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL database successfully.');

    const server = app.listen(ENV.PORT, () => {
      console.log(`🚀 Farahna API server running at http://localhost:${ENV.PORT}`);
      console.log(`📡 Health Check: http://localhost:${ENV.PORT}/api/health`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
      const forceExit = setTimeout(() => {
        console.error('⚠️ Forcefully terminating after 10s shutdown timeout');
        process.exit(1);
      }, 10000);
      forceExit.unref();

      server.close(async () => {
        console.log('🔒 Closed HTTP server successfully.');
        try {
          await prisma.$disconnect();
          console.log('🔌 Disconnected Prisma database pool.');
          clearTimeout(forceExit);
          process.exit(0);
        } catch (err) {
          console.error('❌ Error disconnecting from database:', err);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
