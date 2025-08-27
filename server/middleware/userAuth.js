import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const {token} = req.cookies;

    if (!token) {
        return res.json({ success: false, message: "Unauthorized" });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        // Ensure req.body is always defined
        if (!req.body) req.body = {};
        if(decodedToken.id){
            req.body.userId = decodedToken.id;
        }else{
            return res.json({ success: false, message: "Invalid Token" });
        }
        next();
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
 export default userAuth;
