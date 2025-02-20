import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { meterProvider } from 'src/tracing';

@Injectable()
export class RequestsMetricsInterceptor implements NestInterceptor {
  private activeRequestsMetric;

  constructor() {
    const meter = meterProvider.getMeter('nestjs-app');
    this.activeRequestsMetric = meter.createCounter('http_requests', {
      description: 'Number of HTTP requests',
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    return next.handle().pipe(
      tap({
        next: (response) => {
          const labels = {
            service_name: 'ceos-api',
            method: request.method,
            route: request.url,
            status_code: response.statusCode,
          };
          this.activeRequestsMetric.add(1, labels);
        },
        error: (err) => {
          const labels = {
            service_name: 'ceos-api',
            method: request.method,
            route: request.url,
            status_code: err?.status || 500,
            error: true,
          };
          this.activeRequestsMetric.add(1, labels);
        },
      }),
    );
  }
}
