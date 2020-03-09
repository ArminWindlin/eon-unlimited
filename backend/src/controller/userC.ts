import {User} from '../model/user';
import {logError, sendErrorToSocket} from '../util/error';
import * as TokenGenerator from 'uuid-token-generator';
import {io, socketClientMap, clientSocketMap} from '../socket';

const tokgen = new TokenGenerator(512, TokenGenerator.BASE62);

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
        if (name < 3)
            return sendErrorToSocket('Name needs to contain at least 3 signs.', socketId);

        // userName max length
        if (name > 12)
            return sendErrorToSocket('Name can\'t be longer than 12 signs.', socketId);

        // check if user already exists
        let nameRegex = new RegExp(`^${name}$`, 'i');
        if (await User.countDocuments({name: nameRegex}) > 0)
            return sendErrorToSocket('Username already taken', socketId);

        // set name
        newUser.name = name;

        // generate new token
        newUser.token = tokgen.generate();

        // save user core
        const user = new User(newUser);
        await user.save();

        clientSocketMap.set(name, socketId);
        socketClientMap.set(socketId, name);
        io.to(socketId).emit('UPDATE_TOKEN', {token: newUser.token, userName: name});
    } catch (err) {
        logError(err, 'userC', 'addUser');
        sendErrorToSocket(err, socketId);
    }
};

