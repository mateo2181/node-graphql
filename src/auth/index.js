const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const SECRET_KEY = 'secretKey!!!!'
const saltRounds = 10;


const login = async(email,password) => {
    // const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
        throw new Error(`Could not find account: ${email}`);
        // return res.status(404).send({ message: `Could not find account: ${email}` })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw new Error(`Incorrect credentials`);
        //return error to user to let them know the password is incorrect
        // return res.status(401).send({ message: 'Incorrect credentials' })
    }

    const token = jwt.sign({ email: user.email }, SECRET_KEY)

    // res.status(201).send({ token: token });
    return { token };
};

const register = async(req,res) => {
    const { email, firstName, lastName, password } = req.body;
    
    let user = await User.findOne({ where: { email: email } });
    if (user) {
        return res.status(404).send({ message: `Already exists an account with email: ${email}` })
    }

    if (!email || !firstName || !lastName || !password) {
        return res.status(403).send({ message: `All fields are required` })
    }

    const hashPassword = await bcrypt.hash(password, saltRounds);
    user = await User.create({ 
        firstName,
        lastName, 
        email,
        password: hashPassword
    });

    const token = jwt.sign({ email: user.email }, SECRET_KEY,{ expiresIn: 86400 })
    res.status(201).send({ token: token });
};

const verifyUser = async(token) => {
    try {
        // const token = req.headers.token || '';
        let decoded = await jwt.verify(token, SECRET_KEY);
        // res.status(200).send(decoded);
        return decoded;
    } catch (error) {
        throw new Error('Token invalid');
        // return false;
        // return res.status(500).send({ message: 'Failed to authenticate token.' });
    }
};

module.exports = {
    login,
    register,
    verifyUser
}