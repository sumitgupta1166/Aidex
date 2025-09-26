export class ApiResponse {
  constructor(statusCode = 200, data = null, message = "Success") {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.data = data;
    this.message = message;
  }
}
