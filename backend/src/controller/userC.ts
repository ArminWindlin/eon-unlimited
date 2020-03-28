import {User} from '../model/user';
import {logError, sendErrorToSocket} from '../util/error';
import * as TokenGenerator from 'uuid-token-generator';
import * as pass from 'bcrypt';
import {clientSocketMap, io, socketClientMap} from '../socket';

const tokgen = new TokenGenerator(512, TokenGenerator.BASE62);
const saltRounds = 10;

export const addUser = async (_name, socketId) => {
    try {

        let name = _name;
        const newUser: any = {};

        // check sign validity
        if (/<|>/.test(name))
            return sendErrorToSocket('The following signs are not allowed: <>', socketId);

        // trim spaces at beginning and end of username
        name = name.trim();

        // userName min length
        if (name.length < 3)
            return sendErrorToSocket('Name needs to contain at least 3 signs.', socketId);

        // userName max length
        if (name.length > 12)
            return sendErrorToSocket('Name can\'t be longer than 12 signs.', socketId);

        // check if user already exists
        let nameRegex = new RegExp(`^${name}$`, 'i');
        if (await User.countDocuments({name: nameRegex}) > 0)
            return sendErrorToSocket('Username already taken', socketId);

        // set name
        newUser.name = name;

        // set default password
        newUser.password = await pass.hash('asdf', saltRounds);

        // generate new token
        newUser.token = tokgen.generate();

        // save user core
        const user = new User(newUser);
        await user.save();

        clientSocketMap.set(name, socketId);
        socketClientMap.set(socketId, name);
        io.to(socketId).emit('UPDATE_TOKEN', {token: newUser.token, user: user});
    } catch (err) {
        logError(err, 'userC', 'addUser');
        sendErrorToSocket(err, socketId);
    }
};

export const updatePassword = async (userName, password, socketId) => {
    try {
        // userName min length
        if (password.length < 4)
            return sendErrorToSocket('Password needs to contain at least 4 signs.', socketId);

        const hash = await pass.hash(password, saltRounds);
        await User.updateOne({name: userName}, {password: hash, passwordSet: true});

        io.to(socketId).emit('INFO', 'Successfully updated password');
    } catch (err) {
        logError(err, 'userC', 'updatePassword');
        sendErrorToSocket(err, socketId);
    }
};

export const login = async (userName, password, socketId) => {
    try {
        const userR = await User.findOne({name: userName});
        if (userR === null)
            return sendErrorToSocket('User doesn\'t exist', socketId);
        const user = userR.toObject();
        const valid = await pass.compare(password, user.password);
        if (!valid)
            return sendErrorToSocket('Invalid Password', socketId);

        io.to(socketId).emit('UPDATE_TOKEN', {token: user.token, user: user});
    } catch (err) {
        logError(err, 'userC', 'login');
        sendErrorToSocket(err, socketId);
    }
};

