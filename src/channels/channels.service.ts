import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channels.entity';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelsRepository: Repository<Channel>,
  ) {}

  async create(name: string): Promise<Channel> {
    const channel = new Channel();
    channel.name = name;
    console.log('create channel', channel);
    return this.channelsRepository.save(channel);
  }

  async findById(id: number): Promise<Channel> {
    return this.channelsRepository.findOne({
      where: {
        id,
      }
    })
  }

  async find(offset: number, limit: number,): Promise<Channel[]> {
    Logger.debug('Now get channels service')
    return this.channelsRepository.find({
      skip: offset,
      take: limit,
    });
  }
}