import { Test, TestingModule } from '@nestjs/testing';
import { ChannelsResolver } from './channels.resolver';
import { ChannelsService } from './channels.service';
import { Channel } from './channels.entity';

const mockChannel: Channel = {
  id: 1,
  name: 'Mock Channel',
  messages: [],
};

const postsServiceMock = {
  findById: jest.fn(
    (id: number): Promise<Channel> => Promise.resolve(mockChannel),
  ),
  find: jest.fn((): Promise<Channel[]> => Promise.resolve([mockChannel])),
  create: jest.fn(
    (name: string): Promise<Channel> => Promise.resolve(mockChannel),
  ),
};

describe('PostsResolver', () => {
  let resolver: ChannelsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelsResolver,
        {
          provide: ChannelsService,
          useValue: postsServiceMock,
        },
      ],
    }).compile();
    resolver = module.get<ChannelsResolver>(ChannelsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should ceate a channel', async () => {
    const result = await resolver.createChannel('Mock Channel');
    expect(result.id).toEqual(1);
  });

  it('should query all channels', async () => {
    const result = await resolver.channels();
    expect(Array.isArray(result)).toEqual(true);
  });
});
