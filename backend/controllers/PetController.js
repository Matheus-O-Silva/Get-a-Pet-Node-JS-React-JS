const Pet = require('../models/Pet')

// helpers
const getUserByToken = require('../helpers/get-user-by-token');
const getToken = require('../helpers/get-token');
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class PetController {

    // create a pet
    static async create(req, res) {
        const name = req.body.name
        const age = req.body.age
        const description = req.body.description
        const weight = req.body.weight
        const color = req.body.color
        const images = req.files
        const available = true

        // validations
        if (!name) {
            res.status(422).json({ message: 'The field name is required' })
            return
        }

        if (!age) {
            res.status(422).json({ message: 'The field age is required' })
            return
        }

        if (!weight) {
            res.status(422).json({ message: 'The field weight is required' })
            return
        }

        if (!color) {
            res.status(422).json({ message: 'The field color is required' })
            return
        }

        if (!images) {
            res.status(422).json({ message: 'The field images is required' })
            return
        }

        // get user
        const token = getToken(req)
        const user = await getUserByToken(token)

        // create pet
        const pet = new Pet({
        name: name,
        age: age,
        description: description,
        weight: weight,
        color: color,
        available: available,
        images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone,
            },
        })

        images.map((image) => {
            pet.images.push(image.filename)
        })

        try {
            const newPet = await pet.save()

        res.status(201).json({
            message: 'Pet registerd with success',
            newPet: newPet,
        });

        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    // get all registered pets
    static async getAll(req, res) {
        const pets = await Pet.find().sort('-createdAt')

        res.status(200).json({
            pets: pets,
        });
    }

    // get all user pets
    static async getAllUserPets(req, res) {
        // get user
        const token = getToken(req);
        const user = await getUserByToken(token);

        const pets = await Pet.find({ 'user._id': user._id })

        res.status(200).json({
            pets,
        });
    }

    // get all user adoptions
    static async getAllUserAdoptions(req, res) {
        // get user
        const token = getToken(req);
        const user = await getUserByToken(token);

        const pets = await Pet.find({ 'adopter._id': user._id });

        res.status(200).json({
            pets,
        });
    }

    // get a specific pet
    static async getPetById(req, res) {
        const id = req.params.id;

        // check if id is valid
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'invalid id' });
            return;
        }

        // check if pet exists
        const pet = await Pet.findOne({ _id: id });

        if (!pet) {
            res.status(404).json({ message: 'Pet not found' });
            return;
        }

        res.status(200).json({
            pet: pet,
        });
    }

    // remove a pet
    static async removePetById(req, res) {
        const id = req.params.id

        // check if id is valid
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'invalid id' });
            return;
        }

        // check if pet exists
        const pet = await Pet.findOne({ _id: id });

        if (!pet) {
            res.status(404).json({ message: 'Pet not found' });
            return;
        }

        // check if user registered this pet
        const token = getToken(req);
        const user = await getUserByToken(token);

        if (pet.user._id.toString() != user._id.toString()) {
            res.status(404).json({
                message:
                'error in process this action, try again later or contact the support',
            });

            return;
        }

        await Pet.findByIdAndDelete(id);

        res.status(200).json({ message: 'Pet removed with success' });
    }

    // update a pet
    static async updatePet(req, res) {
        const id = req.params.id

        const name = req.body.name
        const age = req.body.age
        const description = req.body.description
        const weight = req.body.weight
        const color = req.body.color
        const images = req.files
        const available = req.body.available

        const updateData = {}

        // check if pet exists
        const pet = await Pet.findOne({ _id: id });

        if (!pet) {
            res.status(404).json({ message: 'Pet not found' });
            return;
        }

        // check if user registered this pet
        const token = getToken(req);
        const user = await getUserByToken(token);

        if (pet.user._id.toString() != user._id.toString()) {
            res.status(404).json({
                message:
                'error in process this action, try again later or contact the support',
            });

            return;
        }

        // validations
        if (!name) {
            res.status(422).json({ message: 'the field name is required' });
            return;
        } else {
            updateData.name = name;
        }

        if (!age) {
            res.status(422).json({ message: 'the field age is required' });
            return;
        } else {
            updateData.age = age;
        }

        if (!weight) {
            res.status(422).json({ message: 'the field weight is required' });
            return;;
        } else {
            updateData.weight = weight;
        }

        if (!color) {
            res.status(422).json({ message: 'the field color is required' });
            return;
        } else {
            updateData.color = color;
        }

        if (images.length > 0) {
            updateData.images = [];
            images.map((image) => {
                updateData.images.push(image.filename)
            });
        }

        if (!available) {
            res.status(422).json({ message: 'the field available is required' });
            return;
        } else {
            updateData.available = available;
        }

        updateData.description = description;

        await Pet.findByIdAndUpdate(id, updateData);
        const petUpdated = await Pet.findOne({ _id: id });

        res.status(200).json({ pet: petUpdated, message: 'Pet updated with success' });
    }

    // schedule a visit
    static async schedule(req, res) {
        const id = req.params.id;

        // check if pet exists
        const pet = await Pet.findOne({ _id: id });

        // check if user owns this pet
        const token = getToken(req);
        const user = await getUserByToken(token);

        if (pet.user._id.equals(user._id)) {
            return res.status(422).json({
                message: "you can't schedule a visit with your own pet",
            });
            
        }

        // check if user has already adopted this pet
        if (pet.adopter) {
                if (pet.adopter._id.equals(user._id)) {
                    return res.status(422).json({
                    message: "you're already schedule a visit for this pet",
                });
            }
        }

        // add user to pet
        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image,
        }

        await Pet.findByIdAndUpdate(pet._id, pet);

        res.status(200).json({
            message: `The visit was schedule with success, contact ${pet.user.name} by phone ${pet.user.phone}`,
        });
    }

  // conclude a pet adoption
    static async concludeAdoption(req, res) {
        const id = req.params.id;

        // check if pet exists
        const pet = await Pet.findOne({ _id: id });

        pet.available = false;

        await Pet.findByIdAndUpdate(pet._id, pet);

        res.status(200).json({
            pet: pet,
            message: `Congrats! the adoption was concluded with success`,
        });
    }
}