import express from 'express'
import authentication from '../middleware/authentication'
import { checkMe, logOut, loginWithCredential, loginWithGoogle, register } from '../controllers/auth'

const router = express.Router()

router.post('/register', register)
router.post('/login', loginWithCredential)
router.post('/login-google', loginWithGoogle)
router.get('/me', authentication, checkMe)
router.delete('/logout', logOut)

const AuthRouter = router
export default AuthRouter
