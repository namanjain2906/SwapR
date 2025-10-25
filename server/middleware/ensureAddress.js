import User from "../models/User.js";

export const hasAddress = (user) =>
	user?.area && user?.city && user?.state && user?.city_code;

const ensureAddress = async (req, res, next) => {
	try {
		if (!req?.auth) {
			return res.status(401).json({ success: false, message: "Authentication required." });
		}

		const { userId } = req.auth();
		if (!userId) {
			return res.status(401).json({ success: false, message: "Authentication required." });
		}

		if (req.userDocument && hasAddress(req.userDocument)) {
			return next();
		}

		const user = await User.findById(userId);
		if (!hasAddress(user)) {
			return res.status(400).json({
				success: false,
				message: "Please complete your address before continuing.",
			});
		}

		req.userDocument = user;
		return next();
	} catch (error) {
		console.error("ensureAddress error:", error);
		return res.status(500).json({ success: false, message: "Unable to verify address." });
	}
};

export default ensureAddress;
