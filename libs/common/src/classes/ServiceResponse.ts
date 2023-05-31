export class ServiceResponse<T> {
  public data?: T;
  public message = '';
  public success = true;
  public statusCode = 200;
}
