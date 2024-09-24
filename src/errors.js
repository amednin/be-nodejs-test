class BaseError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class NotFoundError extends BaseError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

class BadRequestError extends BaseError {
    constructor(message = "Bad request") {
        super(message, 400);
    }
}

class InternalServerError extends BaseError {
    constructor(message = "Internal server error") {
        super(message, 500);
    }
}
  