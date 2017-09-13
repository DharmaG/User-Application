const bcrypt = require('bcrypt');


// Encryption using bcrypt


//STEP #1: Generate an acryption "salt"
// (introduces an element of randomness to the encryption)
const salt1 = bcrypt.genSaltSync(10);

//STEP #2: Encrypt the string using the salt
const scrambled1 = bcrypt.hashSync('swordfish', salt1);

console.log('Encrypting "swordfish".......................');
console.log('    salt -> ' + salt1);
console.log('encrypted -> ' + scrambled1);


const salt2 = bcrypt.genSaltSync(10);
const scrambled2 = bcrypt.hashSync('swordfish', salt2);

console.log('Encrypting "swordfish".......................');
console.log('    salt -> ' + salt2);
console.log('encrypted -> ' + scrambled2);

console.log('Is the 2nd password "swordfish"?');
console.log(bcrypt.compareSync('swordfish', scrambled2));
console.log('Is the 2nd password "Swordfish"?');
console.log(bcrypt.compareSync('Swordfish', scrambled2));
// bcrypt.hashSync()
