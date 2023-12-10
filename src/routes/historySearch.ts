import express from 'express'
import authentication from '../middleware/authentication'
import { addHistory, deleteAllHistory, deleteHistory, getAllHistory } from '../controllers/historySearch'
import validationId from '../middleware/validation'

const router = express.Router()

router.post('/:targetUser', authentication, addHistory)
router.get('/', authentication, getAllHistory)
router.delete('/', authentication, deleteAllHistory)
router.delete('/:id', authentication, validationId('history'), deleteHistory)

const HistoryRouter = router
export default HistoryRouter
