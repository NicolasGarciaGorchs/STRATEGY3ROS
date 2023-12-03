const { Router } = require('express')
const passport = require('passport')
// const Users = require('../models/Users.model')
// const {getHashedPassword, comparePassword} = require('../utils/bcrypts')

const router = Router()

router.post('/register', passport.authenticate('register', {failureRedirect:'/failregister'}) , 
async(req,res) =>{
    try{
        res.status(201).json({status: 'success', payload: req.user})
    } catch(error) {
        console.log(error)
        res.status(500).json({status: 'error', error: 'Internal Server Error'})
    }
})

router.get('/failregister', (req, res) => {
    res.json({status:'error', error: 'Failed register'})
})

router.post('/login', passport.authenticate('login',{failureRedirect:'/faillogin'}), async(req,res) =>{
    try{        
        if(!req.user) 
        return res
            .status(400)
            .json({status:'error', error: 'Invalid credentials'})
        
        req.session.user = {
            email: req.user.email,
            role: 'user',
        }

        res.json({status: 'success', payload:'New session initialized'})
        
    } catch(error) {
        console.log(error)
        res.status(500).json({status: 'error', error: 'Internal Server Error'})
    }
})

router.get('/faillogin' , (req, res) => {
    res.json({status:'error', error: 'Invalid login'})
})

router.get('/github', passport.authenticate('github', {scope: ['user: email']}), (req, res) => {}
)

router.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/login'}), (req, res) => {
    req.session.user = req.user
    res.redirect('/profile')
})

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/googlecallback', passport.authenticate('google', { failureRedirect: '/login' }), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/profile');
});


module.exports = router