import { Module, OnModuleDestroy, Logger } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Channel } from './channels/channels.entity';
import { Message } from './messages/messages.entity';
import { ChannelsResolver } from './channels/channels.resolver';
import { ChannelsService } from './channels/channels.service';
import { MessagesService } from './messages/messages.service';
import { MessageResolver } from './messages/messages.resolver';

@Module({
  providers: [
    ChannelsService,
    ChannelsResolver,
    MessagesService,
    MessageResolver,
  ],
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: false,
      playground: true,
      typePaths: ['./src/schema.gql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
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
  ],
})
export class AppModule {}
