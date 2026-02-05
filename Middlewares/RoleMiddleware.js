const apiResponse=require("../Helpers/apiResponse")

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return apiResponse.unauthorizedResponse(res,"Access Denied.")
    }
    next();
  };
};

module.exports = authorize;