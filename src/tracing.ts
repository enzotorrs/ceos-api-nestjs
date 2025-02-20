import {
  diag,
  DiagConsoleLogger,
  DiagLogLevel,
  metrics,
} from '@opentelemetry/api';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);
export const meterProvider = new MeterProvider({
  readers: [
    new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
        url: 'http://olgtm:4317',
      }),
      exportIntervalMillis: 5000,
      exportTimeoutMillis: 2000,
    }),
  ],
});

// Set the global MeterProvider
metrics.setGlobalMeterProvider(meterProvider);
const sdk = new NodeSDK({
  serviceName: 'ceos-api',
  traceExporter: new OTLPTraceExporter({
    url: 'http://olgtm:4317',
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: 'http://olgtm:4317',
    }),
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

process.on('beforeExit', async () => {
  await sdk.shutdown();
});

export const initalizeTracing = async () => {
  return sdk.start();
};
