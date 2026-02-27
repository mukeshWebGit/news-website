import bcrypt from "bcryptjs";

bcrypt.hash("super@123", 10).then(hash => {
    console.log(hash);
});
 