const User = require('../models/User');

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
            res.status(201).json({message: "user created"});
        } catch(err){
            res.status(500).json({message: error});
        }
    }
}