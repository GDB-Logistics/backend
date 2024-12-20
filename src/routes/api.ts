import express from 'express';

import * as apiController from '../controllers/api/api';

const router = express.Router();

router.post('/', apiController.newOrder);

export default router;
