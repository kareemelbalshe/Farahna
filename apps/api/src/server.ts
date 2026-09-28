import app from './app';
import { ENV } from './config/env';
import { prisma } from './config/db';

async function bootstrap() {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL database successfully.');

    app.listen(ENV.PORT, () => {
      console.log(`🚀 Farahna API server running at http://localhost:${ENV.PORT}`);
      console.log(`📡 Health Check: http://localhost:${ENV.PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
