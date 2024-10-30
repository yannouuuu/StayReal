export class BeRealError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BeRealError";
  }
}

export class ExpiredTokenError extends BeRealError {
  constructor() {
    super("Access token has expired, you need refresh");
    this.name = "ExpiredTokenError";
  }
}