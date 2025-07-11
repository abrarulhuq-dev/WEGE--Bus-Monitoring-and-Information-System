import jwt from "jsonwebtoken";

const generateToken = (user, secret, expiresIn = "15m") => {
    return jwt.sign(
        { id: user._id, username: user.username }, 
        secret,                                   
        { expiresIn }                              
    );
};

 
export const generateAccessToken = (user) => {
    return generateToken(user, process.env.ACCESS_TOKEN_SECRET, "15m");
};

export const generateRefreshToken = (user) => {
    return generateToken(user, process.env.REFRESH_TOKEN_SECRET, "7d"); 
};


const verifyToken = (token, secret) => {
    try {
        if (!token) {
           return null
        }

        const decoded = jwt.verify(token, secret);
        return decoded;
    } catch (error) {
        return null;
    }
};

export const verifyAccessToken=(token)=>{
        return verifyToken(token,process.env.ACCESS_TOKEN_SECRET)
}
export const verifyRefreshToken=(token)=>{
    return verifyToken(token,process.env.REFRESH_TOKEN_SECRET)
}

