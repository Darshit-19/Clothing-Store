// This function takes a Zod schema and returns a middleware function
export const validate = (schema) => (req, res, next) => {
  try {
    // 1. Attempt to parse and validate the request body against the schema
    const validatedBody = schema.parse(req.body);

    // 2. If validation is successful, replace the request body with the validated data
    // This is a security best practice as it strips any unknown properties
    req.body = validatedBody;

    // 3. Pass control to the next middleware or controller
    next();
  } catch (error) {
    // 4. If validation fails, Zod throws an error. Catch it and send a 400 response.
    return res.status(400).json({
      messages: error.flatten().fieldErrors,
    });
  }
};