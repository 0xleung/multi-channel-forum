import { Logger } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CacheControl } from 'nestjs-gql-cache-control';
import { Message } from './messages.entity';
import { MessagesService } from './messages.service';

@Resolver((of) => Message)
export class MessageResolver {
  constructor(private messageService: MessagesService) {}

  @Query((returns) => [Message])
  @CacheControl({ maxAge: 3 })
  async messages(
    @Args('channelId') channelId: number,
    @Args('offset') offset = 0,
    @Args('limit') limit = 20,
  ): Promise<Message[]> {
    Logger.debug('offset in resolver', offset, limit);
    return this.messageService.getMessagesForChannel(channelId, offset, limit);
  }

  @Mutation((returns) => Message)
  async createMessage(
    @Args('title') title: string,
    @Args('content') content: string,
    @Args('channelId') channelId: number,
  ): Promise<Message> {
    return this.messageService.createMessage(title, content, channelId);
  }
}
