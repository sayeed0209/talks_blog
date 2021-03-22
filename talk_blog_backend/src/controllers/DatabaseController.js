//DEPENDENCIES DECLARATION
    import mysql from "mysql";
    import { config } from '../config/app-config.js';

//CONTROLLER CLASS
    export default class DatabaseController {
        constructor() {
            this.connection = mysql.createConnection({
                host: config().db.HOST,
                user: config().db.USER,
                password: config().db.PWD,
            });
        }

        init() {
            return new Promise((resolve, reject) => {
                this.check()
                    .then(res => resolve(res))
                    .catch(err => {
                        console.log(err.message)
                        this.build()
                            .then(res => resolve(res))
                            .catch(err => reject(err))
                    }) 
            })  
        }

        check() {
            return new Promise(async (resolve, reject) => {
                const c = this.connection; 

                c.query("USE TalkBlog", err => {
                    if(err) reject(new Error("\n***There was an error with MySQL server.***"))
                    else resolve("\n# Using TalkBlog database");
                })

                //STEP 1 #USE_DATABASE COMPLETED
                /////////////////////////////////////////////////////////////////////////////////////////////////////////     
            });
        }

        build() {
            return new Promise(async (mainResolve, mainReject) => {
                const c = this.connection;

                console.log("\n# Creating database...")
                const createDatabase = new Promise((resolve, reject) => {
                    c.query("CREATE DATABASE IF NOT EXISTS TalkBlog", err => {
                        if(err) reject(new Error("\n***Couldn't create database.***"));
                        else c.query("USE TalkBlog", () => resolve("///// Database TalkBlog created."))
                    })
                });
                
                try { console.log(await createDatabase) } catch(error) { mainReject(error.message) }

                //STEP 1 #CREATE_DATABASE COMPLETED
                /////////////////////////////////////////////////////////////////////////////////////////////////////////     

                const queries = [
                    {
                        query: `CREATE TABLE Users(user_id INT AUTO_INCREMENT, username VARCHAR(30) UNIQUE, name VARCHAR(20), lastname VARCHAR(30), description VARCHAR(255), 
                            email VARCHAR(70) UNIQUE, password VARCHAR(255), picture_filename VARCHAR(255), admin BOOL, PRIMARY KEY(user_id))`,
                        name: "Users"
                    },
                    {
                        query: `CREATE TABLE Posts(post_id INT AUTO_INCREMENT, user_id INT, title VARCHAR(100), body LONGTEXT, views INT, created_at DATETIME, updated_at DATETIME,
                            PRIMARY KEY(post_id), FOREIGN KEY(user_id) REFERENCES Users(user_id)) ON DELETE CASCADE`,
                        name: "Posts"
                    },
                    {
                        query: `CREATE TABLE Comments(comment_id INT AUTO_INCREMENT, post_id INT, user_id INT, body LONGTEXT, created_at DATETIME, updated_at DATETIME,
                            PRIMARY KEY(comment_id), FOREIGN KEY(post_id) REFERENCES Posts(post_id) ON DELETE CASCADE, FOREIGN KEY(user_id) REFERENCES Users(user_id)) ON DELETE CASCADE`,
                        name: "Comments"
                    },
                    {
                        query: `CREATE TABLE Categories(category_id INT AUTO_INCREMENT, category VARCHAR(20), PRIMARY KEY(category_id))`,
                        name: "Categories"
                    },
                    {
                        query: `CREATE TABLE PostCategories(postcategory_id INT AUTO_INCREMENT, category_id INT, post_id INT, 
                            PRIMARY KEY(postcategory_id), FOREIGN KEY(category_id) REFERENCES Categories(category_id) ON DELETE CASCADE, FOREIGN KEY(post_id) REFERENCES Posts(post_id)) ON DELETE CASCADE`,
                        name: "PostCategories"
                    },
                    {
                        query: `CREATE TABLE Images(image_id INT AUTO_INCREMENT, post_id INT, filename VARCHAR(255), 
                            PRIMARY KEY(image_id), FOREIGN KEY(post_id) REFERENCES Posts(post_id)) ON DELETE CASCADE`,
                        name: "Images"
                    },
                    {
                        query: `CREATE TABLE Reactions(reaction_id INT AUTO_INCREMENT, user_id INT, post_id INT, reaction BOOL, 
                            PRIMARY KEY(reaction_id), FOREIGN KEY(user_id) REFERENCES Users(user_id) ON DELETE CASCADE, FOREIGN KEY(post_id) REFERENCES Posts(post_id)) ON DELETE CASCADE`,
                        name: "Reactions"
                    },
                    {
                        query: `CREATE TABLE Followers(follower_id INT AUTO_INCREMENT, user_id INT, following INT, 
                            PRIMARY KEY(follower_id), FOREIGN KEY(user_id) REFERENCES Users(user_id)) ON DELETE CASCADE`,
                        name: "Followers"
                    },
                ]
                
                //STEP 2 #QUERY_DATA_ARRAY COMPLETED
                ///////////////////////////////////////////////////////////////////////////////////////////////////////// 

                console.log("\n# Building tables...")
                for(const q of queries) {
                    const promise = new Promise((resolve, reject) => {
                        c.query(q.query, err => {
                            if(err) reject(new Error("\n***Couldn't create table " + q.name + ". Reverting build database process.***"));
                            else resolve("///// " + q.name + " table created.");
                        })
                    })

                    try { console.log(await promise) } catch(error) { mainReject(error.message) }
                }

                //STEP 3 #QUERY_EXECUTION COMPLETED
                ///////////////////////////////////////////////////////////////////////////////////////////////////////// 

                this.populate().then(() => mainResolve("\n## Database created, populated and ready for working! ##")).catch(err => mainReject(err));

                //STEP 4 *FINAL* #DATABASE_POPULATE COMPLETED
                ///////////////////////////////////////////////////////////////////////////////////////////////////////// 
            })
        }

        populate() {
            return new Promise(async (mainResolve, mainReject) => {
                const c = this.connection;

                const queries = [
                    {
                        query: `INSERT INTO Users(username, name, lastname, description, email, password, picture_filename, admin)
                            VALUES("admin", "Eloy", "Rodríguez", "SuperAdmin of TalkBlog platform", "rodriguezeloy99@gmail.com", 
                            "$2b$12$YcvlgsPjZic6vIfQQx1hFuKTen2vWma4SoyTeqb0Ibmqos3aDEwPS", "$2b$12$YcvlgsPjZic6vIfQQx1hFuNazhIcuMvVyrAFujhZ8FgDr88zxDqHq.jpg", TRUE),
                            ("rick96", "Ricardo", "López", "I'm a football amateur player and I will show my progress through TalkBlog. Follow me! :D", "ricardo96@gmail.com", 
                            "$2b$12$YcvlgsPjZic6vIfQQx1hFuKTen2vWma4SoyTeqb0Ibmqos3aDEwPS", "$2b$12$YcvlgsPjZic6vIfQQx1hFuyF01rI5Cb.oBeZPkgU6LG60eBmom9Jy.jpg", FALSE)`,
                        name: "Users"
                    },
                    {
                        query: `INSERT INTO Posts(user_id, title, body, views, created_at, updated_at)
                            VALUES(1, "Who am I", "I'm the backend developer of TalkBlog, and my boss wants me to create a test post, so there here it is.", 
                                0,"2020-10-24 12:00:00", "2020-10-24 12:00:00")`,
                        name: "Posts"
                    },
                    {
                        query: `INSERT INTO Comments(post_id, user_id, body, created_at, updated_at)
                            VALUES(1, 1, "Yep, still me, just commenting on my own post", "2020-10-24 12:05:00", "2020-10-24 12:05:00")`,
                        name: "Comments"
                    },
                    {
                        query: `INSERT INTO Categories(category)
                            VALUES("Tech"), ("Other")`,
                        name: "Categories"
                    },
                    {
                        query: `INSERT INTO PostCategories(category_id, post_id)
                            VALUES(1, 1), (2,1)`,
                        name: "PostCategories"
                    },
                    {
                        query: `INSERT INTO Images(post_id, filename)
                            VALUES(1, "$2b$12$YcvlgsPjZic6vIfQQx1hFuQlMUpu5SnWuvlrdUWfxLhMAjH1qu5oO.jpg")`,
                        name: "Images"
                    },
                    {
                        query: `INSERT INTO Reactions(user_id, post_id, reaction)
                            VALUES(2, 1, TRUE)`,
                        name: "Reactions"
                    },
                    {
                        query: `INSERT INTO Followers(user_id, following)
                            VALUES(2, 1)`,
                        name: "Followers"
                    },
                ]
                
                //STEP 1 #QUERY_DATA_ARRAY COMPLETED
                ///////////////////////////////////////////////////////////////////////////////////////////////////////// 

                console.log("\n# Populating tables...")
                for(const q of queries) {
                    const promise = new Promise((resolve, reject) => {
                        c.query(q.query, err => {
                            if(err) reject(new Error("\n***Couldn't populate table " + q.name + ". Reverting build database process.***"));
                            else resolve("///// " + q.name + " table populated.");
                        })
                    })

                    try { console.log(await promise) } catch(error) { mainReject(error.message) }
                }

                //STEP 2 #QUERY_EXECUTION COMPLETED
                ///////////////////////////////////////////////////////////////////////////////////////////////////////// 

                mainResolve();
            });
        }
    }
//CONTROLLER CLASS