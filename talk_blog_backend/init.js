//DEPENDENCIES DECLARATION
    import path from "path";
    import pkg_express from "express";
    import pkg_file_upload from "express-fileupload";
    import pkg_passport from "passport";
    import pkg_body_parser from "body-parser";
    import pkg_cors from "cors";
    import { config } from "./src/config/app-config.js";
//DEPENDENCIES DECLARATION

//EXPRESS MODULES USING
    const app = pkg_express();

    app.use(pkg_file_upload())
    app.use(pkg_body_parser.json());
    app.use(pkg_body_parser.urlencoded({ extended: true }));
    app.use(pkg_passport.initialize());
    app.use(pkg_express.static(path.resolve() + "/public"))
    app.use(pkg_cors({origin: "http://localhost:8080"}));
    app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
     });
//EXPRESS MODULES USING

//CONTROLLER OBJECTS
    import router from "./src/router/main.js";
    import DatabaseController from "./src/controllers/DatabaseController.js";
    import AuthController from "./src/controllers/AuthController.js";
    import PostController from "./src/controllers/PostController.js";
    import ProfileController from "./src/controllers/ProfileController.js";

    const database = new DatabaseController();
    const auth = new AuthController(database.connection, pkg_passport);
    const post = new PostController(database.connection);
    const profile = new ProfileController(database.connection);
//CONTROLLERS OBJECT

//ROUTER CALL
    router(app, database, auth, post, profile);

//START DATABASE AND RUN SERVER
    database.init()
        .then(() => app.listen(config().PORT, () => console.log("\n#### Server running nice and steady! Make requests to >> localhost:" + config().PORT + " << #####")))
        .catch(() => console.error("\n***Server encountered an error. Server closed.***"));