import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import database
import sequelize from './config/database';
import { initUserModel } from './models/User';
import { initCategoryModel, setupCategoryAssociations } from './models/Category';
import { initLinkModel, setupLinkAssociations } from './models/Link';

// Initialize models
initUserModel(sequelize);
initCategoryModel(sequelize);
initLinkModel(sequelize);

// Setup associations
setupCategoryAssociations();
setupLinkAssociations();

import routes from './routes';

// Create Express app instance
const app = express();

// Apply middleware
app.use(helmet()); // Security middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Register routes
app.use('/api', routes);

// Basic error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Sync database
sequelize.sync().then(() => {
  console.log('Database synced successfully');
}).catch((error) => {
  console.error('Error syncing database:', error);
});

export default app;