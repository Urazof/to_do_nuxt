import { v4 as uuidv4 } from 'uuid';

export const generateUID = () => {
    // Generate a UUID v4, which is a 32-character hexadecimal string
    const uuid = uuidv4();

    // Convert the UUID to a shorter 24-character hexadecimal string
    return uuid.replace(/-/g, '').slice(0, 24);
};