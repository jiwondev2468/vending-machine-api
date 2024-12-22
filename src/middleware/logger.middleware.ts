import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
      const statusCode = res.statusCode;
      const responseTime = `${Date.now() - start}ms`;
      const body = req.body;
      const query = req.query;
      const ip = req.headers['x-real-ip'] ?? req.ip;

      if (statusCode === 404) {
        const data = {
          ip: ip,
          method: method,
          path: originalUrl,
          statusCode: statusCode,
          time: responseTime,
          query: query,
          body: body,
        };

        this.logger.log(JSON.stringify(data));
      }
    });

    next();
  }
}
