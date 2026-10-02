import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import type { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {

  catch(exception: unknown, host: ArgumentsHost) {
    const cxt = host.switchToHttp();
    const response = cxt.getResponse<Response>();
    const request = cxt.getRequest<Request>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception instanceof HttpException
      ? exception.getResponse()
      : "Internal Server Error";

    const message = typeof exceptionResponse === 'string'
      ? exceptionResponse
      : ((exceptionResponse as Record<string, unknown>).message ?? exceptionResponse);

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });

  }
}