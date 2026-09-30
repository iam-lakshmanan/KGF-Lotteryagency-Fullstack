const secretKeyMiddleware = (req, res, next) => {
  try {
    const accessKey = req.headers["x-kgf-access-key"];

    // Check header exists
    if (!accessKey) {
      return res.status(401).json({
        success: false,
        message: "Access key missing",
      });
    }

    // Validate key
    if (accessKey !== process.env.ADMIN_PORTAL_KEY) {
      return res.status(403).json({
        success: false,
        message: "Invalid access key",
      });
    }

    // Allow request
    next();
  } catch (error) {
    console.error("SECRET KEY MIDDLEWARE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default secretKeyMiddleware;