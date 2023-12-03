const authController = require('../auth/controller.auth')
const templateController = require('../templates/controller.template')


const router = app => {
    app.use('/', templateController)
    app.use('/auth', authController)
    app.use('*', (req,res) => {
        res.render('notFound')
    })
}

module.exports = router