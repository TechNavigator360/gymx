class AppError extends Error {
    constructor(code) {
        super(String(code));
        this.code = code;
    }
}

module.exports = {
    AppError,
};