import jwt from 'jsonwebtoken';

export const isVerified = (token: string) => {
    try {
        const decoded = jwt.verify(token, "fsngskfngnhwgdnkjfncskndusghvskhmsihvvnbmsv");
        return decoded;
    } catch (err) {
        return false;
    }
}