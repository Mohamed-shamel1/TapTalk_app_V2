import bootstrap from './app.controller.js';
import * as dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

const {io} = await bootstrap();
import * as massageService from './modules/massage/massage.service.js';
massageService.setIO(io);