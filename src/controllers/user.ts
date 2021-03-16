import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../dbmodels/user';

var usersOnline = new Map(); // userid -> refreshToken

//@ts-ignore
const URI: string = process.env.DB_URI;
mongoose.connect(URI,
    {useNewUrlParser: true, useUnifiedTopology: true},
    (err) => {
        if (err) {
            console.log("Error:", err);
        }
        else {
            console.log("Connected to DB:", URI);
        }
    }
)

function generateUserID(req: any, res: any) {
    var newId: string = Math.random().toString(36).substr(2, 6);
    User.findById(newId, (err: any, user: any) => {
        if (err) {
            console.log(err);
        }
        if (user === null) {
            registerCallback(req, res, newId);
        }
        else {
            generateUserID(req, res);
        }
    });
}

async function registerCallback(req: any, res: any, newUserId: string) {
    // Create an user object
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    if (await User.findOne({email: req.body.email}) != null) {
        res.status(401).send('email allready occupied');
        return;
    }
    let user = new User({
        _id: newUserId,
        name: req.body.name,
        password: hashPassword,
        email: req.body.email,
        friends: [],
        chats: [],
        notifications: [],
        desc: "",
        icon: 0
    });

    // Save User in the database
    user.save((err: any, registeredUser: any) => {
        if (err) {
            console.log(err)
        } else {
            // create payload then Generate an access token
            let payload = {
                id: registeredUser._id
            };
            res.status(200).send(payload);
        }
    });
}

function generateAccesToken(userInfo: any) {
    if (process.env.ACCESS_SECRET_TOKEN)
        return jwt.sign(userInfo, process.env.ACCESS_SECRET_TOKEN, {expiresIn: '450s'});
    else {
        console.log("Error: process.env", process.env.ACCESS_SECRET_TOKEN);
        return undefined;
    }
}

export default class UserController {

    static async register(req: any, res: any) {
        console.log("register:", req.body);
        //Hash password 
        generateUserID(req, res);
    }

    static async login(req: any, res: any) {
        console.log("login:", req.body);

        if (usersOnline.has(req.body.email)) {
            return res.status(401).send("Allready logged on another device");
        }

        User.findOne({ email: req.body.email }, async (err: any, user: any) => {
            if (err) {
                console.log("DB ERROR", err)
            } else {
                if (user) {
                    const validPass = await bcrypt.compare(req.body.password, user.password);
                    if (!validPass)
                        return res.status(401).send("Mobile/Email or Password is wrong");
                    user = user.toJSON();
                    
                    // Create and assign token
                    const token = generateAccesToken({id: user._id, email: user.email});
                    let refresh_token = undefined;
                    if (process.env.REFRESH_SECRET_TOKEN) {
                        refresh_token = jwt.sign({id: user._id, email: user.email}, process.env.REFRESH_SECRET_TOKEN);
                        usersOnline.set(user.email, refresh_token);
                    }
                    res.status(200).send({"token": token, "refresh": refresh_token});
                }
                else {
                    res.status(401).send('Invalid mobile')
                }
    
            }
        })
    }

    static async logout(req: any, res: any) {
        console.log("logout");
        usersOnline.delete(req.user.email);
        res.json("Logout Success");
    }

    static async refreshToken(req:any, res:any) {
        console.log("refresh token");
        const refreshToken = req.body.token;
        if (refreshToken === null)
            return res.sendStatus(401);
        //@ts-ignore
        jwt.verify(refreshToken, process.env.REFRESH_SECRET_TOKEN, (err, user: any) => {
            if (err)
                return res.sendStatus(403);
            if (usersOnline.has(user.email) && refreshToken === usersOnline.get(user.email)) {
                const accessToken = generateAccesToken({id: user.id});
                res.json({accessToken: accessToken});
            }
        });
    }

    static async data(req:any, res:any) {
        res.send("secret data only for logged Users");
    }

    static verifyUserToken(req: any, res: any, next: any) {
        let token = req.headers.authorization;
        if (!token) return res.status(401).send("Access Denied / Unauthorized request");
    
        try {
            token = token.split(' ')[1] // Remove Bearer from string
    
            if (token === 'null' || !token) return res.status(401).send('Unauthorized request');
    
            //@ts-ignore
            let verifiedUser = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
            if (!verifiedUser)
                return res.status(401).send('Unauthorized request')
    
            req.user = verifiedUser; // user_id
            if (!usersOnline.has(req.user.email)) {
                return res.status(401).send('Unauthorized request')
            }
            next();
    
        } catch (error) {
            res.status(400).send("Invalid Token");
        }
    
    }

}