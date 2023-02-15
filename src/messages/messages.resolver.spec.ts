import { Test, TestingModule } from '@nestjs/testing';
import { MessageResolver } from './messages.resolver';
import { MessagesService } from './messages.service';
import { Message } from './messages.entity';
import { Channel } from '../channels/channels.entity';

const mockChannel: Channel = {
  id: 1,
  name: 'Mock Channel',
  messages: [],
};

const mockMessage: Message = {
  id: 1,
  title: 'Mock Message Title',
  channel: mockChannel,
  content: 'Mock Message Content',
  createdAt: new Date(),
};

const postsServiceMock = {
  getMessagesForChannel: jest.fn(
    (channelId: number): Promise<Message[]> => Promise.resolve([mockMessage]),
  ),
  createMessage: jest.fn(
    (title: string, content: string, channelId: number): Promise<Message> =>
      Promise.resolve(mockMessage),
  ),
};

describe('PostsResolver', () => {
  let resolver: MessageResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageResolver,
        {
          provide: MessagesService,
          useValue: postsServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<MessageResolver>(MessageResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should create single message for channel', async () => {
    const result = await resolver.createMessage(
      'Mock Message Title',
      'Mock Message Content',
      1,
    );
    expect(result.id).toEqual(1);
  });

  it('should query messages by channelId', async () => {
    const result = await resolver.messages(1);
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(1);
    expect(Object.keys(result.at(0)).length).toEqual(5);
    expect(result.at(0).id).toEqual(1);
  });
});
