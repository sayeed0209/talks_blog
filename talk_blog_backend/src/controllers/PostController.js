//DEPENDENCIES DECLARATION
    import bcrypt from "bcrypt"
    import { config } from "../config/app-config.js";

//CONTROLLER CLASS
    export default class PostController {
        constructor(connection) {
            this.connection = connection;
            this.defaultQuerySelect = `Posts.post_id, Posts.title, Posts.body, Posts.views, Posts.created_at, Posts.updated_at, 
                Users.user_id, Users.username, Users.name, Users.lastname, Users.description, Users.picture_filename AS profile_picture`,
            this.defaultQueryJoin = `Posts INNER JOIN Users ON Posts.user_id = Users.user_id`
        }

        full(page) {
            return new Promise((resolve, reject) => {
                this.connection.query(`SELECT ${this.defaultQuerySelect} FROM ${this.defaultQueryJoin} LIMIT 20 OFFSET ${(page-1) * 20}`, (err, data) => {
                    if(err || !data.length) reject("Couldn't get posts.");
                    else resolve(data); 
                })
            })
        }

    //GET FUNCTIONS
        getPost(id) {
            return new Promise((resolve, reject) => {
                this.connection.query(`SELECT ${this.defaultQuerySelect}, Images.filename FROM ${this.defaultQueryJoin}
                INNER JOIN Images ON Posts.post_id = Images.post_id WHERE Posts.post_id = ${id}`, 
                (err, data) => {
                    if(err || !data.length) reject("Post was not found. Check the id provided and try again.");
                    else { 
                        const newViews = (Number(data[0].views) + 1);
                        this.connection.query(`UPDATE Posts SET views = ${newViews} WHERE post_id = ${data[0].post_id}`)
                        resolve(data[0]);
                    }
                })
            })
        }

        getPostComments(id, page) {
            return new Promise((resolve, reject) => {
                this.connection.query(`SELECT Comments.comment_id, Comments.body, Comments.created_at, Comments.updated_at,
                Users.user_id, Users.username, Users.picture_filename AS profile_picture
                FROM (Comments INNER JOIN Users ON Comments.user_id = Users.user_id) INNER JOIN Posts ON Posts.post_id = Comments.post_id 
                WHERE Posts.post_id=${id} LIMIT 20 OFFSET ${(page-1) * 20}`, (err, data) => {
                    if(err || !data.length) reject("Couldn't get posts.");
                    else resolve(data); 
                })
            })
        }

        getCategories() {
            return new Promise((resolve, reject) => {
                this.connection.query(`SELECT * FROM Categories`, (err, data) => {
                    if(err || !data.length) reject("Categories were not found.");
                    else resolve(data);
                })
            })
        }

        getPostCategories(id) {
            return new Promise((resolve, reject) => {
                this.connection.query(`SELECT Categories.category FROM PostCategories INNER JOIN Categories ON PostCategories.category_id = Categories.category_id 
                    WHERE post_id = ${id}`, (err, data) => {
                    if(err || !data.length) reject("Categories were not found. Check the id provided and try again.");
                    else resolve(data);
                })
            })
        }

        getPostImages(id) {
            return new Promise((resolve, reject) => {
                this.connection.query(`SELECT filename FROM Images WHERE post_id = ${id}`, (err, data) => {
                    if(err || !data.length) reject("Images were not found. Check the id provided and try again.");
                    else resolve(data);
                })
            })
        }

        listByRecent(limit) {
            return new Promise((resolve, reject) => {
                this.connection.query(`SELECT ${this.defaultQuerySelect}, Images.filename FROM ${this.defaultQueryJoin}
                INNER JOIN Images ON Posts.post_id = Images.post_id ORDER BY Posts.created_at DESC LIMIT ${limit}`, (err, data) => {
                    if(err || !data.length) reject("Couldn't get recent posts.");
                    else resolve(data);
                })
            })
        }

        listByViews(limit) {
            return new Promise((resolve, reject) => {
                this.connection.query(`SELECT ${this.defaultQuerySelect} FROM ${this.defaultQueryJoin} ORDER BY Posts.views DESC LIMIT ${limit}`, (err, data) => {
                    if(err || !data.length) reject("Couldn't get popular posts.");
                    else resolve(data);
                })
            })
        }

        listByCategory(id, limit) {
            return new Promise((resolve, reject) => {
                this.connection.query(`SELECT ${this.defaultQuerySelect}, Categories.category, Images.filename FROM ((${this.defaultQueryJoin} INNER JOIN PostCategories ON PostCategories.category_id=${id}) 
                INNER JOIN Categories ON Categories.category_id = ${id})
                INNER JOIN Images ON Posts.post_id = Images.post_id  WHERE PostCategories.post_id=Posts.post_id ORDER BY Posts.created_at DESC LIMIT ${limit}`, (err, data) => {
                    if(err || !data.length) reject("Couldn't get posts by category.");
                    else resolve(data);
                })
            })
        }

        listByUser(id, page) {
            return new Promise((resolve, reject) => {
                this.connection.query(`SELECT ${this.defaultQuerySelect}, Images.filename FROM ${this.defaultQueryJoin} 
                INNER JOIN Images ON Posts.post_id = Images.post_id WHERE Users.user_id=${id} ORDER BY Posts.created_at DESC LIMIT 20 OFFSET ${(page-1) * 20}`, (err, data) => {
                    if(err) reject("Couldn't get posts by user.");
                    else if(!data.length) reject("No posts found.");
                    else resolve(data);
                })
            })
        }

        getFollowers(id){
            return new Promise((resolve, reject) => {
                this.connection.query(`SELECT COUNT (user_id) AS followers FROM Followers WHERE user_id=${id}`, (err, data) => {
                    if(err) reject("Couldn't get followers.");
                    // else if(!data.length) reject("No posts found.");
                    else resolve(data[0]);
                })
            })
        }

        //This one is not tested, I don't know how it will work until more posts are added for debug
        listByLikes(limit) {
            return new Promise((resolve, reject) => {
                this.connection.query(`${this.defaultQuerySelect}, Rections.post_id, COUNT(Rections.post_id) AS likes, 
                FROM (((Reactions INNER JOIN Posts ON Reactions.post_id = Posts.post_id) INNER JOIN Users ON Posts.user_id = Users.user_id) 
                INNER JOIN Images ON Posts.post_id = Images.post_id) GROUP BY Rections.post_id WHERE Rections.reaction = 1 ORDER BY likes DESC LIMIT ${limit}`, 
                (err, data) => {
                    if(err || !data.length) reject("Couldn't get most liked posts.");
                    else resolve(data);
                })
            })
        }

    //CREATE FUNCTIONS
        newPost(data, user) {
            return new Promise((resolve, reject) => {
                this.connection.query(`INSERT INTO Posts (user_id, title, body, views, created_at, updated_at) VALUES (${user.user_id}, "${data.title}", "${data.body}", 0, NOW(), NOW())`,
                err => {
                    if(err) reject("Couldn't create post.")
                    else resolve("Post created!")
                })
            })     
        }

        newComment(data, user) {
            return new Promise((resolve, reject) => {
                this.connection.query(`INSERT INTO Comments (post_id, user_id, body, created_at, updated_at) VALUES (${data.post_id}, ${user.user_id}, "${data.body}", NOW(), NOW())`,
                err => {
                    if(err) reject("Couldn't create comment.")
                    else resolve("Comment created!")
                })
            }) 
        }

        newReaction(data, user) {
            return new Promise((resolve, reject) => {
                this.connection.query(`SELECT reaction_id FROM Reactions WHERE user_id=${user.user_id} AND post_id=${data.post_id}`, (err, reac) => {
                    if(err || !reac.length) { 
                        this.connection.query(`INSERT INTO reactions (user_id, post_id, reaction) VALUES (${user.user_id}, ${data.post_id}, ${data.reaction})`, err => {
                            if(err) reject("Couldn't add reaction to post.")
                            else resolve("Reaction added to post.");
                        })
                    } else { 
                        if(data.reaction === null) {
                            this.connection.query(`DELETE FROM Reactions WHERE reaction_id=${reac[0].reaction_id}`, err => {
                                if(err) reject("There was a problem removing reaction.")
                                else resolve("Reaction removed.")
                            })
                        } else {
                            this.connection.query(`UPDATE Reactions SET reaction=${data.reaction} WHERE reaction_id=${reac[0].reaction_id}`, err => {
                                if(err) reject("There was a problem changing reaction.")
                                else resolve("Reaction changed.")
                            })
                        }
                    }
                })
            }) 
        }

    //EDIT FUNCTIONS
        editPost(data, user) {
            return new Promise((resolve, reject) => {
                this.connection.query(`SELECT user_id FROM Posts WHERE post_id=${data.post_id}`, (err, post) => {
                    if(err || !post.length) reject("Couldn't find post to edit. Check the id provided and try again.")
                    else {
                        if(post[0].user_id != user.user_id && !user.admin) reject("User logged is not the owner of the post, either an admin.");
                        else {
                            this.connection.query(`UPDATE Posts SET title="${data.title}", body="${data.body}", updated_at=NOW() WHERE post_id=${data.post_id}`, err => {
                                if(err) reject("Couldn't edit post.");
                                else resolve("Post updated!");
                            })
                        }
                    }
                })
            })
        }

        editComment(data, user) {
            return new Promise((resolve, reject) => {
                this.connection.query(`SELECT user_id FROM Comments WHERE comment_id=${data.comment_id}`, (err, com) => {
                    if(err || !com.length) reject("Couldn't find comment to edit. Check the id provided and try again.")
                    else {
                        if(com[0].user_id != user.user_id && !user.admin) reject("User logged is not the owner of the comment, either an admin.");
                        else {
                            this.connection.query(`UPDATE Comments SET body="${data.body}", updated_at=NOW() WHERE comment_id=${data.comment_id}`, err => {
                                if(err) reject("Couldn't edit comment.");
                                else resolve("Comment updated!");
                            })
                        }
                    }
                })
            })
        }

    //REMOVE FUNCTIONS
        removePost(data, user) {
            return new Promise((resolve, reject) => {
                this.connection.query(`SELECT user_id FROM Posts WHERE post_id=${data.post_id}`, (err, post) => {
                    if(err || !post.length) reject("Couldn't find post to remove. Check the id provided and try again.")
                    else {
                        if(post[0].user_id != user.user_id && !user.admin) reject("User logged is not the owner of the post, either an admin.");
                        else {
                            this.connection.query(`DELETE FROM Posts WHERE post_id=${data.post_id}`, err => {
                                if(err) reject("Couldn't delete post.");
                                else resolve("Post deleted!");
                            })
                        }
                    }
                })
            })
        }

        removeComment(data, user) {
            return new Promise((resolve, reject) => {
                this.connection.query(`SELECT user_id FROM Comments WHERE comment_id=${data.comment_id}`, (err, com) => {
                    if(err || !com.length) reject("Couldn't find comment to remove. Check the id provided and try again.")
                    else {
                        if(com[0].user_id != user.user_id && !user.admin) reject("User logged is not the owner of the comment, either an admin.");
                        else {
                            this.connection.query(`DELETE FROM Comments WHERE comment_id=${data.comment_id}`, err => {
                                if(err) reject("Couldn't delete comment.");
                                else resolve("Comment deleted!");
                            })
                        }
                    }
                })
            })
        }

        uploadImages(files, id) {
            return new Promise((resolve, reject) => {
                if(!files) reject("No files uploaded.");
                
                this.connection.query(`SELECT title FROM Posts WHERE post_id=${id}`, (err, data) => {
                    if(err || !data.length) reject("Post do not exist.")
                    else {
                        let c = 1;
                        const hash = bcrypt.hashSync(data[0].title, config().SECRET);
                        
                        for(const image of files.images) {
                            const fileName =  hash + "_" + c++ + ".jpg";
                            const filePath = config().PUBLIC_PATH + "/images/post/" + fileName;
                            const file = image;

                            try { if(fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch(error) { }
                            file.mv(filePath);
        
                            this.connection.query(`SELECT post_id FROM Images WHERE post_id=${id}`, (err, img) => {
                                if(err || !img.length) {
                                    this.connection.query(`INSERT INTO Images (post_id, filename) VALUES(${id}, "${fileName}")`, err => {
                                        if(err) reject("File uploaded but not updated on database.")
                                        else resolve("Profile picture uploaded and updated")
                                    })
                                } else {
                                    this.connection.query(`DELETE FROM Images WHERE post_id=${id}`, err => {
                                        this.connection.query(`INSERT INTO Images (post_id, filename) VALUES(${id}, "${fileName}")`, err => {
                                            if(err) reject("File uploaded but not updated on database.")
                                            else resolve("Profile picture uploaded and updated")
                                        })
                                    })
                                }
                            })   
                        }                 
                    }
                    
                })
            }) 
        }
    }
//CONTROLLER CLASS