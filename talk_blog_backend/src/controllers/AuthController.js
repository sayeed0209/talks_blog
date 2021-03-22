//DEPENDENCIES DECLARATION
    import bcrypt from "bcrypt";
    import pkg_local_strategy from "passport-local";
    import pkg_jwt_strategy from "passport-jwt";
    import { config } from "../config/app-config.js";
//DEPENDENCIES DECLARATION

//CONTROLLER CLASS
    export default class AuthController {
        constructor(connection, passport) {
            this.connection = connection;
            this.passport = passport;
            this.init();
        }

        init() {
            //DEFINE PASSPORT STRATEGY
                const LocalStrategy = pkg_local_strategy.Strategy;
                const JWTStrategy = pkg_jwt_strategy.Strategy;
                const JWTExtract = pkg_jwt_strategy.ExtractJwt;

                this.passport.use('local', new LocalStrategy({
                    usernameField: "email",
                    passwordField: "password",
                }, (email, password, done) => {
                    if(!email || !password ) return done(null, false, "All fields are required!");
                    
                    this.connection.query(`SELECT * FROM Users WHERE email='${email}'`, (err, data) => {
                        if (err) return done("Servers are busy. Please, try again later.");
                        if(!data.length) return done(null, false, "The email is incorrect!");
                        
                        const hashedPass = bcrypt.hashSync(password, config().SECRET);
                        if(hashedPass != data[0].password) return done(null, false, "Incorrect password!");
                        else return done(null, data[0]);     
                    });
                }));

                this.passport.use(new JWTStrategy({ 
                    jwtFromRequest: JWTExtract.fromAuthHeaderAsBearerToken(), 
                    secretOrKey: config().SECRET 
                }, (payLoad, done) => {
                    this.connection.query(`SELECT * FROM Users WHERE user_id='${payLoad.user_id}'`, (err, data) => {
                        if(err) return done(err);
                        else return done(null, data[0]);     
                    });
                }));

            //DEFINE PASSPORT STRATEGY               
            /////////////////////////////////////////////////////////////////////////////////////////////////////////  
        }

        logout(request) {
            return new Promise((resolve, reject) => {
                request.logout();
                resolve("User logged out, remember to modify API auth token.");
            })         
        }

        register(data) {
            return new Promise((resolve, reject) => {
                this.connection.query(`INSERT INTO Users(username, name, lastname, description, email, password, picture_filename, admin)
                    VALUES("${data.username}", "${data.name}", "${data.lastname}", "Hello there! I'm using TalkBlog :D", "${data.email}", 
                    "${bcrypt.hashSync(data.password, config().SECRET)}", "default.jpg", 0)`, 
                err => {
                    if(err) reject("There was an error with registration process. Try again later.")
                    else resolve("Registration done!")
                })
            })
        }

        //Middleware to check if email already exists before registration proccess starts
        mwUniqueEmail(req, res, next) {
            this.connection.query(`SELECT email FROM Users WHERE email='${req.body.email}'`, (err, data) => { 
                if(err || !data.length) next()
                else res.send({ data: "Email already exists!", status: false });
            })
        }

        //Middleware to check if username already exists before registration proccess starts
        mwUniqueUsername(req, res, next) {
            this.connection.query(`SELECT username FROM Users WHERE username='${req.body.username}'`, (err, data) => { 
                if(err || !data.length) next()
                else res.send({ data: "Username already exists!", status: false });
            })
        }
    }
//CONTROLLER CLASS