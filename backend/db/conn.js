const mongoose = require('mongoose');

async function main(){
    await mongoose.connect('mongodb://localhost:27017/getapet')
    console.log('conected in mongoose')
}

main().catch((err) => console.log('erro ao conectar: ' + err));

module.exports = mongoose;