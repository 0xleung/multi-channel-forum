import { Logger } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CacheControl } from 'nestjs-gql-cache-control';

import { Channel } from './channels.entity';
import { ChannelsService } from './channels.service';

@Resolver()
export class ChannelsResolver {
  constructor(private readonly channelsService: ChannelsService) {}

  @Mutation(() => Channel)
  async createChannel(@Args('name') name: string): Promise<Channel> {
    return this.channelsService.create(name);
  }

  @Query(() => [Channel])
  @CacheControl({ maxAge: 3 })
  async channels(
    @Args('offset') offset = 0,
    @Args('limit') limit = 20,
  ): Promise<Channel[]> {
    return this.channelsService.find(offset, limit);
  }
}
