const {Router} = require('express')
const protectedRoute = require('../middlewares/protected-route.middleware')

const router = Router()

router.get('/register', (req,res) => {
    res.render('register')
})

router.get('/login', (req,res) => {
    res.render('login')
})

router.get('/profile', protectedRoute ,(req,res) => {
    const user = {
            email: req.session.user.email,
            role: req.session.user.role,
        }
    return res.render('profile', user)
})

module.exports = router