const mongoose = require('mongoose');

async function main(){
    await mongoose.connect('mongodb+srv://mttdev:<db_password>@pet-api.nhsox.mongodb.net/?retryWrites=true&w=majority&appName=pet-api');
    console.log('conected in mongoose')
}

main().catch((err) => console.log('erro ao conectar: ' + err));

module.exports = mongoose;