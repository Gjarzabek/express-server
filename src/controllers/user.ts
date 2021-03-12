import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const DB_URI = "";

mongoose.connect(DB_URI, function(err){
    if(err){
        console.error('Error! ' + err)
    } else {
      console.log('Connected to mongodb')      
    }
});

export default class UserController {

    static async register(req: any, res: any) {
        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hasPassword = await bcrypt.hash(req.body.password, salt);
    
        // Create an user object
        let user = new User({
            email: req.body.email,
            name: req.body.name,
            password: hasPassword,
            user_type_id: req.body.user_type_id
        })
    
        // Save User in the database
        user.save((err: any, registeredUser: any) => {
            if (err) {
                console.log(err)
            } else {
                // create payload then Generate an access token
                let payload = { id: registeredUser._id, user_type_id: req.body.user_type_id || 0 };
                const token = jwt.sign(payload, config.TOKEN_SECRET);
                res.status(200).send({ token })
            }
        })
    }

    static async login(req: any, res: any) {

        User.findOne({ email: req.body.email }, async (err, user) => {
            if (err) {
                console.log(err)
            } else {
                if (user) {
                    const validPass = await bcrypt.compare(req.body.password, user.password);
                    if (!validPass) return res.status(401).send("Mobile/Email or Password is wrong");
    
                    // Create and assign token
                    let payload = { id: user._id, user_type_id: user.user_type_id };
                    const token = jwt.sign(payload, config.TOKEN_SECRET);
    
                    res.status(200).header("auth-token", token).send({ "token": token });
                }
                else {
                    res.status(401).send('Invalid mobile')
                }
    
            }
        })
    }

}
