require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./config/database');

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected');

    // sync({ force }) apenas em test; em prod usa migrations
    const syncOptions = process.env.NODE_ENV === 'test'
      ? { force: true }
      : { alter: false };

    await sequelize.sync(syncOptions);
    console.log('✅ Models synchronized');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 CineStream API running on http://localhost:${PORT}`);
      console.log(`📄 Docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
