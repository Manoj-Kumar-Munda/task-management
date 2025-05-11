class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    error = [],
    code = "",
    stack = "",
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.success = false;
    this.errors = error;

    if (code) {
      this.code = code;
    }

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
