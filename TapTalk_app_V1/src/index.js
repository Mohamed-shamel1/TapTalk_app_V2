import bootstrap from './app.controller.js';
const {io} = await bootstrap();
import * as massageService from './modules/massage/massage.service.js';
massageService.setIO(io);