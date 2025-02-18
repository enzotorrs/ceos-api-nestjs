import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { SequelizeInstrumentation } from 'opentelemetry-instrumentation-sequelize';
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

const sdk = new NodeSDK({
  serviceName: 'ceos-api',
  traceExporter: new OTLPTraceExporter({
    url: 'http://otel-collector:4317',
  }),
  instrumentations: [
    new HttpInstrumentation(),
    new NestInstrumentation(),
    new SequelizeInstrumentation(),
  ],
});

process.on('beforeExit', async () => {
  await sdk.shutdown();
});

export const initalizeTracing = async () => {
  return sdk.start();
};
