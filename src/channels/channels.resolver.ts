import { Logger } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

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
  async channels(
    @Args('offset') offset: number = 0,
    @Args('limit') limit: number = 20,
  ): Promise<Channel[]> {
    Logger.debug('Now get channels');
    return this.channelsService.find(offset, limit);
  }
}
