import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './messages.entity';
import { Channel } from '../channels/channels.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
  ) {}

  async createMessage(
    title: string,
    content: string,
    channelId: number,
  ): Promise<Message> {
    const channel = await this.channelsRepository.findOne({
      where: {
        id: channelId,
      },
    });

    if (!channel) {
      throw new Error('Channel not found');
    }

    const message = new Message();
    message.title = title;
    message.content = content;
    message.channel = channel;

    return this.messagesRepository.save(message);
  }

  async getMessagesForChannel(
    channelId: number,
    offset: number,
    limit: number,
  ): Promise<Message[]> {
    Logger.debug('offset', offset);
    return this.messagesRepository.find({
      where: { channel: { id: channelId } },
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    });
  }
}
