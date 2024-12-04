const configObj = {
  environment: process.env.NODE_ENV || "development",
  port: process.env.PORT || 8000,
  jwtConfig: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  googleMapsApiKey: process.env.MAPS_API_KEY,
};

export default configObj;
