export const tryCatch = handler => {
  return async (req, res, next) => {
    try {
        handler(req,res,next);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
};
