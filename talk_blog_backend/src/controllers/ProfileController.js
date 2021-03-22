//DEPENDENCIES DECLARATION
import fs from "fs";
import bcrypt from "bcrypt";
import { config } from "../config/app-config.js";


//CONTROLLER CLASS
    export default class ProfileController {
        constructor(connection, auth) {
            this.connection = connection;
            this.defaultQuerySelect = `Users.user_id, Users.username, Users.name, Users.lastname, Users.description, Users.email, Users.picture_filename, Users.admin`,
            this.auth = auth
        }

        full(page) {
            return new Promise((resolve, reject) => {
                this.connection.query(`SELECT ${this.defaultQuerySelect} FROM Users LIMIT 20 OFFSET ${(page-1) * 20}`, (err, data) => {
                    if(err || !data.length) reject("Couldn't get users.");
                    else resolve(data); 
                })
            })
        }

        getProfile(id) {
            return new Promise((resolve, reject) => {
                this.connection.query(`SELECT ${this.defaultQuerySelect} FROM Users WHERE Users.user_id = ${id}`, 
                (err, data) => {
                    if(err || !data.length) reject("User was not found. Check the id provided and try again.");
                    else resolve(data[0]);
                })
            })  
        }

        //Not fully tested
        getFollowers(id) {
            return new Promise((resolve, reject) => {
                this.connection.query(`SELECT ${this.defaultQuerySelect} FROM Users INNER JOIN Followers ON Followers.following = ${id} 
                    WHERE Users.user_id = Followers.user_id`, (err, data) => {
                    if(err) reject("No followers found. Check the id provided and try again.");
                    else resolve(data);
                })
            })
        }

        newFollower(from, to) {
            return new Promise((resolve, reject) => {
                this.connection.query(`SELECT follower_id FROM Followers WHERE user_id=${from} AND following=${to}`, (err, data) => {
                    if(err || !data.length) {
                        this.connection.query(`INSERT INTO Followers (user_id, following) VALUES (${from}, ${to})`, err => {
                            if(err) reject("Couldn't add new follower");
                            else resolve("Follower added!");
                        })
                    } else reject("Follower already exists!")
                })               
            })
        }

        removeFollower(from, to) {
            return new Promise((resolve, reject) => {
                this.connection.query(`DELETE FROM Followers WHERE user_id=${from} AND following=${to}`, err => {
                    if(err) reject("Couldn't remove follower");
                    else resolve("Follower removed!");
                })
            })
        }

        //Just to have a working version, this will only edit basic info.
        editUser(data, user) {
            return new Promise((resolve, reject) => {
                this.connection.query(`SELECT user_id, username FROM Users WHERE user_id=${data.user_id}`, (err, profile) => {
                    if(err || !com.length) reject("Couldn't find user to edit. Check the id provided and try again.")
                    else {
                        if(profile[0].user_id != user.user_id && !user.admin) reject("User logged is not the owner of the profile, either an admin.");
                        else {
                            this.connection.query(`UPDATE Users SET name="${data.name}", lastname="${data.lastname}", description="${data.description}" 
                            WHERE user_id=${data.user_id}`, err => {
                                if(err) reject("Couldn't edit user.");
                                else resolve("User updated!");
                            })
                        }
                    }
                })
            })
        }

        removeUser(data, user) {
            return new Promise((resolve, reject) => {
                this.connection.query(`SELECT user_id FROM Users WHERE user_id=${data.user_id}`, (err, profile) => {
                    if(err || !com.length) reject("Couldn't find user to remove. Check the id provided and try again.")
                    else {
                        if(profile[0].user_id != user.user_id && !user.admin) reject("User logged is not the owner of the profile, either an admin.");
                        else {
                            this.connection.query(`DELETE FROM Users WHERE user_id=${data.user_id}`, err => {
                                if(err) reject("Couldn't delete user.");
                                else this.auth.logout().then(res => resolve("User deleted! " + res))
                            })
                        }
                    }
                })
            })
        }

        uploadProfilePicture(picture, id) {
            return new Promise((resolve, reject) => {
                if(!picture) reject("No files uploaded.");
                
                this.connection.query(`SELECT username FROM Users WHERE user_id=${id}`, (err, data) => {
                    if(err || !data.length) reject("User do not exist.")
                    else {
                        const fileName = bcrypt.hashSync(data[0].username, config().SECRET) + ".jpg";
                        const filePath = config().PUBLIC_PATH + "/images/profile/" + fileName;
                        const file = picture.image;
    
                        try { if(fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch(error) { }
                        file.mv(filePath);
    
                        this.connection.query(`UPDATE Users SET picture_filename="${fileName}" WHERE user_id=${id}`, err => {
                            if(err) reject("File uploaded but not updated on database.")
                            else resolve("Profile picture uploaded and updated")
                        })  
                    }
                    
                })
            }) 
        }
    }
//CONTROLLER CLASS