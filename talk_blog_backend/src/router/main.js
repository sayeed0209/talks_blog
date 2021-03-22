import pkg_web_token from "jsonwebtoken";
import { config } from "../config/app-config.js";

export default function router(app, database, auth, post, profile) {
    //DEFAULT RESPONSE TO SUCCESS AND FAILURE REQUESTS
        const response = (prom, res) => { 
            prom.then(data => res.json({ data: data, status: true }))
                .catch(error => res.json({ data: error, status: false }))
        };

    // GET REQUESTS
        app.get("/post/get/:id", (req, res) => response(post.getPost(req.params.id, req.user || {id:0}), res));
        app.get("/post/get/comments/:id/:page", (req, res) => response(post.getPostComments(req.params.id, req.params.page), res));
        app.get("/categories", (req, res) => response(post.getCategories(), res));
        app.get("/get/followers/:id", (req, res) => response(post.getFollowers(req.params.id), res));
        app.get("/post/get/categories/:id", (req, res) => response(post.getPostCategories(req.params.id), res));
        app.get("/post/get/images/:id", (req, res) => response(post.getPostImages(req.params.id), res));
        app.get("/post/list/recent/:limit", (req, res) => response(post.listByRecent(req.params.limit || 10), res))
        app.get("/post/list/popular/:limit", (req, res) => response(post.listByViews(req.params.limit || 10), res))
        app.get("/post/list/category/:id/:limit", (req, res) => response(post.listByCategory(req.params.id, req.params.limit || 10), res))
        app.get("/post/list/user/:id/:page", (req, res) => response(post.listByUser(req.params.id, req.params.page), res))
        app.get("/post/list/liked/:limit", (req, res) => response(post.listByLikes(req.params.limit || 10), res))

        app.get("/profile/get/:id", (req, res) => response(profile.getProfile(req.params.id), res))
        app.get("/profile/followers/:id", (req, res) => response(profile.getFollowers(req.params.id), res))

        app.get("/auth/check", auth.passport.authenticate("jwt", {session: false}), (req, res) => res.send({ data: "Authenticated!", staus: true }));
        app.get("/auth/logout", auth.passport.authenticate("jwt", {session: false}), (req, res) => response(auth.logout(req), res));

    // GET FULL REQUESTS
        app.get("/post/full/:page", auth.passport.authenticate("jwt", {session: false}), (req, res) => response(post.full(req.params.page), res))
        app.get("/profile/full/:page", auth.passport.authenticate("jwt", {session: false}), (req, res) => response(profile.full(req.params.page), res))

    //POSTS REQUEST
        app.post("/auth/login", (req, res) => { 
            auth.passport.authenticate("local", { session: false }, (err, user) => {
                if(err || !user) return res.status(400).json({ data: 'Email or password are incorrect.', status: false });
                
                req.login(user, { session: false }, err => {
                    if(err) res.send({ data: "Something went wrong...", status: false});

                    const token = pkg_web_token.sign(JSON.stringify(user), config().SECRET);
                    return res.json({ data: user, token: token, status: true });
                });
            })(req, res);
        });

        //Maybe I change these 2 middlewares in the future for just 1 function. For the time, it stays like this
        app.post("/auth/register", auth.mwUniqueEmail.bind(database), auth.mwUniqueUsername.bind(database), (req, res) => response(auth.register(req.body), res));
        app.post("/profile/edit", auth.passport.authenticate("jwt", {session: false}), (req, res) => response(profile.editUser(req.body, req.user), res));
        app.post("/proflie/remove", auth.passport.authenticate("jwt", {session: false}), (req, res) => response(profile.removeUser(req.body, req.user), res));

        app.post("/post/new", auth.passport.authenticate("jwt", {session: false}), (req, res) => response(post.newPost(req.body, req.user), res));
        app.post("/comment/new", auth.passport.authenticate("jwt", {session: false}), (req, res) => response(post.newComment(req.body, req.user), res));
        app.post("/reaction/new", auth.passport.authenticate("jwt", {session: false}), (req, res) => response(post.newReaction(req.body, req.user), res));
        app.post("/follower/new", auth.passport.authenticate("jwt", {session: false}), (req, res) => response(profile.newFollower(req.body.from, req.body.to), res));

        app.post("/post/edit", auth.passport.authenticate("jwt", {session: false}), (req, res) => response(post.editPost(req.body, req.user), res));
        app.post("/comment/edit", auth.passport.authenticate("jwt", {session: false}), (req, res) => response(post.editComment(req.body, req.user), res));

        app.post("/post/remove", auth.passport.authenticate("jwt", {session: false}), (req, res) => response(post.removePost(req.body, req.user), res));
        app.post("/comment/remove", auth.passport.authenticate("jwt", {session: false}), (req, res) => response(post.removeComment(req.body, req.user), res));
        app.post("/follower/remove", auth.passport.authenticate("jwt", {session: false}), (req, res) => response(profile.removeFollower(req.body.from, req.body.to), res));

        app.post("/profile/upload_picture", (req, res) => response(profile.uploadProfilePicture(req.files, req.body.user_id), res))
        app.post("/post/upload_images", (req, res) => response(post.uploadImages(req.files, req.body.post_id), res))
}