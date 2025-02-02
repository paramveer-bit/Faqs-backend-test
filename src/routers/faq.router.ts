import { Router } from 'express';
import { addFaq, deleteFaq, getFaq, getFaqInLanguage } from '../controllers/faq.controller';
import { verifyJwt } from '../middelwares/auth';

const router = Router()

router.post('/add', verifyJwt, addFaq)
router.post('/delete', verifyJwt, deleteFaq)
// router.post('/get', getFaq)
router.post('/get', getFaqInLanguage)

export default router;