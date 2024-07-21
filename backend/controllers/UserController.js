const User = require('../models/User');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Helpers
const createUserToken = require('../helpers/create-user-token');
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');

module.exports = class UserController {
    static async register(req, res) {
        const {name, email, phone, password, confirmpassword } = req.body;

        const requiredFields = ['name', 'email', 'phone', 'password', 'confirmpassword'];

        //Validations
        const missingField = requiredFields.find(field => !req.body[field]);

        if (missingField) {
            return res.status(422).json({ message: `The field ${missingField} is required` });
        }

        if (password !== confirmpassword) {
            return res.status(422).json({ message: `The field password and confirmpassword must be equals` });
        }

        //check if user exists
        const userExists = await User.findOne({email:  email})
        if(userExists){
            res.status(422).json({
                message: "this email is already registered"
            });
            return;
        }

        //create a password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        //create a user
        const user = new User({
            name,
            email,
            phone,
            password: passwordHash
        });

        try{
            const newUser = await user.save();
            await createUserToken(newUser, req, res);
        } catch(err){
            res.status(500).json({message: err});
        }
    }

    static async login(req, res) {
        const {email, password} = req.body;

        const requiredFields = ['email','password'];

        //Validations
        const missingField = requiredFields.find(field => !req.body[field]);
        if (missingField) {
            return res.status(422).json({ message: `The field ${missingField} is required` });
        }

        //check if user exists
        const user = await User.findOne({email:  email})
        if(!user){
            res.status(422).json({
                message: "user or password incorrects"
            });
            return;
        }

        //check if password matchs with db password
        const checkPassword = await bcrypt.compare(password, user.password);

        if(!checkPassword){
            res.status(422).json({
                message: "Wrong Password",
            });
            return;
        }

        await createUserToken(user, req, res);
    }

    static async checkUser(req, res){
        let currentUser = null;

        if(req.headers.authorization){
            const token   = getToken(req);
            const decoded = jwt.verify(token, 'secret');

            currentUser   = await User.findById(decoded.id);

            currentUser.password   = null;

            return res.status(200).send(currentUser);
        }

        res.status(200).send(currentUser);
    }

    static async getUserById(req, res){
        const id = req.params.id;

        const user = await User.findById(id).select('-password');

        if(!user){
            res.status(422).json({
                message: "user not found"
            });
            return;
        }

        res.status(200).json({user});
    }

    static async editUser(req, res) {
        const token = getToken(req);

        const user = await getUserByToken(token);
        
        const { name, email, phone, password, confirmpassword } = req.body;

        if(req.file){
            user.image = req.file.filename;
        }

        // validations
        if (!name) {
            res.status(422).json({ message: 'The field name is required' });
            return;
        }

        user.name = name;

        if (!email) {
            res.status(422).json({ message: 'The field email is required' });
            return
        }

        // check if user exists
        const userExists = await User.findOne({ email: email });

        if (user.email !== email && userExists) {
            res.status(422).json({ message: 'please, use other email' });
            return;
        }

        user.email = email;

        if (!phone) {
            res.status(422).json({ message: 'The field phone is required' });
            return
        }

        user.phone = phone;

        // check if password match
        if (password != confirmpassword) {
            res.status(422).json({ error: "Passwords doesn't match" });

            // change password
        } else if (password == confirmpassword && password != null) {
            // creating password
            const salt = await bcrypt.genSalt(12);
            const reqPassword = req.body.password;

            const passwordHash = await bcrypt.hash(reqPassword, salt);

            user.password = passwordHash;
        }

        try {
            // returns updated data
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $set: user },
                { new: true },
            )

            res.json({
                message: 'User updated with success',
                data: updatedUser,
            });

        } catch (error) {
            res.status(500).json({ message: error })
        }
    }
}