import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: ['Ma-N!9Wh[6?&4nDKU/G7Z39H8&K^2'],
    }),
  );
  await app.listen(process.env.PORT || 3000);
  await displayRoutes(app);
}

async function displayRoutes(app: INestApplication) {
  const server = app.getHttpServer();
  const router = server._events.request._router;
  const availableRoutes: [] = router.stack
    .map((layer: { route: { path: any; stack: { method: any }[] } }) => {
      if (layer.route) {
        return {
          route: {
            path: layer.route?.path,
            method: layer.route?.stack[0].method,
          },
        };
      }
    })
    .filter(
      (item: { route: { path: string; stack: { method: string }[] } }) =>
        item !== undefined,
    );
  console.log(availableRoutes);
}
bootstrap();
