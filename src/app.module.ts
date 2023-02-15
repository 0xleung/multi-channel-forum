import { Module, OnModuleDestroy, Logger } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import { ApolloServerPluginCacheControl } from 'apollo-server-core/dist/plugin/cacheControl';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as KeyvRedis from '@keyv/redis';
import Redis from 'ioredis';
import * as Keyv from 'keyv';
import { KeyvAdapter } from '@apollo/utils.keyvadapter';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphqlInterceptor, SentryModule } from '@ntegral/nestjs-sentry';

import { Channel } from './channels/channels.entity';
import { Message } from './messages/messages.entity';
import { ChannelsResolver } from './channels/channels.resolver';
import { ChannelsService } from './channels/channels.service';
import { MessagesService } from './messages/messages.service';
import { MessageResolver } from './messages/messages.resolver';

const redis: Redis = new Redis({
  port: parseInt(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB),
});
const keyvRedis = new KeyvRedis(redis);

@Module({
  providers: [
    ChannelsService,
    ChannelsResolver,
    MessagesService,
    MessageResolver,
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new GraphqlInterceptor(),
    },
  ],
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: process.env.NODE_ENV === 'pro' ? false : true,
      playground: process.env.NODE_ENV === 'pro' ? false : true,
      typePaths: ['./src/schema.gql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
      cache: new KeyvAdapter(new Keyv({ store: keyvRedis }), {
        disableBatchReads: true,
      }),
      plugins: [
        ApolloServerPluginCacheControl({ defaultMaxAge: 5 }), // optional
        responseCachePlugin(),
      ],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [Channel, Message],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Channel, Message]),
    SentryModule.forRoot({
      dsn: process.env.SENTRY_DSN,
      debug: process.env.NODE_ENV === 'pro' ? false : true,
      environment: process.env.NODE_ENV !== 'pro' ? 'production' : 'dev',
      logLevels: ['debug'],
    }),
  ],
})
export class AppModule implements OnModuleDestroy {
  redis: Redis = redis;
  onModuleDestroy() {
    Logger.debug('onModuleDestroy');
    this.redis.disconnect();
  }
}
