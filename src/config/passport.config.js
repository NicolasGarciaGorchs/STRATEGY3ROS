const passport = require('passport')
const local = require('passport-local')
const GithubStrategy = require('passport-github2')
const GoogleStrategy = require('passport-google-oauth20');
const Users = require('../models/Users.model')
const { getHashedPassword, comparePassword } = require('../utils/bcrypts')
const { CLIENT_SECRET_GITHUB, CLIENTE_ID_GITHUB, CLIENT_CALLBACK_GITHUB, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = require('../public/js/config')

const LocalStrategy = local.Strategy

const initilizePassport = () => {
    passport.use(
        'register',
        new LocalStrategy(
            { passReqToCallback: true, usernameField: 'email' },
            async (req, username, password, done) => {
                const { name, lastname, email } = req.body

                try {
                    const user = await Users.findOne({ email: username })
                    if (user) {
                        console.log('Usuario ya existe')
                        return done(null, false)
                    }

                    const userInfo = {
                        name,
                        lastname,
                        email,
                        password: getHashedPassword(password),
                    }

                    const newUser = await Users.create(userInfo)
                    done(null, newUser)
                } catch (error) {
                    done(`Error al crear el usuario: ${error}`)
                }
            }
        )
    )

    passport.use(
        'login',
        new LocalStrategy(
            { usernameField: 'email' },
            async (username, password, done) => {
                try {
                    const user = await Users.findOne({ email: username })
                    if (!user) {
                        console.log("User doesn't exist")
                        return done(null, false)
                    }

                    if (!comparePassword(password, user.password))
                        return done(null, false)

                    return done(null, user)
                } catch (error) {
                    done(error)
                }
            }
        )
    )

    passport.use(
        'github',
        new GithubStrategy(
            {
                clientID: CLIENTE_ID_GITHUB,
                clientSecret: CLIENT_SECRET_GITHUB,
                callbackURL: CLIENT_CALLBACK_GITHUB,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    console.log(profile)

                    const user = await Users.findOne({ email: profile._json.email })

                    if (!user) {
                        const userInfo = {
                            name: profile._json.name,
                            lastname: '',
                            email: profile._json.email,
                            password: '',
                        }

                        const newUser = await Users.create(userInfo)
                        return done(null, newUser)
                    }

                    done(null, user)
                } catch (error) {
                    done(null, error)
                }
            }
        )
    )

    passport.use('google', new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
        scope: ['profile'],
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            const userEmail = profile._json.email;
            const user = await Users.findOne({ email: userEmail })

            if (!user) {
                const userInfo = {
                    name: profile._json.given_name,
                    lastname: profile._json.familiy_name,
                    email: userEmail,
                    password: '',
                }

                const newUser = await Users.create(userInfo)
                return done(null, newUser)
            }
            done(null, user)
        } catch (error) {
            done(null, error)
        }

    }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await Users.findById(id)
        done(null, user)
    })
}

module.exports = initilizePassport
