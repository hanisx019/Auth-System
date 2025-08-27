import User from '../models/userModel.js';

export const getUserDetails = async (req, res) => {
    try {
        const {userId}= req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, userData:{
            name: user.username,
            isVerified: user.isVerified,
        }});
         
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}