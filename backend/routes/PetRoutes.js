const router = require('express').Router();

const PetController = require('../controllers/PetController');

// middlewares
const verifyToken = require('../helpers/verify-token');
const { imageUpload } = require('../helpers/image-upload');

router.post(
    '/create',
    verifyToken,
    imageUpload.array('images'),
    PetController.create,
);

router.get('/test-api', () => {
    res.status(200).json({
        message: "it's alive!"
    });
});

router.get('/', PetController.getAll);
router.get('/mypets', verifyToken, PetController.getAllUserPets);
router.get('/myadoptions', verifyToken, PetController.getAllUserAdoptions);
router.get('/:id', PetController.getPetById);
router.delete('/:id', verifyToken, PetController.removePetById);
router.put(
    '/:id',
    verifyToken,
    imageUpload.array('images'),
    PetController.updatePet,
);
router.put('/schedule/:id', verifyToken, PetController.schedule);
router.put('/conclude/:id', verifyToken, PetController.concludeAdoption);

module.exports = router;