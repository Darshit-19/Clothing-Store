export const validate = (schema) => (req, res, next) => {
  try {
    const validatedBody = schema.parse(req.body);

    req.body = validatedBody;

    next();
  } catch (error) {
    return res.status(400).json({
      messages: error.flatten().fieldErrors,
    });
  }
};
