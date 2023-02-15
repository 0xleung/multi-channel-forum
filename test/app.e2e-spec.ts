import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';

import request from 'supertest-graphql';
import gql from 'graphql-tag';
import { Channel } from 'src/graphql';
import { Message } from 'src/messages/messages.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let testChannelId: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('创建频道', async () => {
    type resChannels = {
      createChannel: Channel;
    };
    const channelName = 'foo channel';
    const data = await request<resChannels>(app.getHttpServer())
      .query(
        gql`
      mutation {
        createChannel(name: "${channelName}") {
          id
          name
        }
      }
    `,
      )
      .expectNoErrors();
    testChannelId = parseInt(data.data.createChannel.id);
    expect(Array.isArray(data.data.createChannel)).toEqual(false);
    expect(data.data.createChannel.name).toEqual(channelName);
  });
  it('获取频道分页', async () => {
    type resChannels = {
      channels: [Channel];
    };
    const data = await request<resChannels>(app.getHttpServer())
      .query(
        gql`
          query Query {
            channels(offset: 0, limit: 2) {
              name
              id
            }
          }
        `,
      )
      .expectNoErrors();
    expect(Array.isArray(data.data.channels)).toEqual(true);
    expect(data.data.channels.length <= 2).toEqual(true);
  });
  it('创建消息', async () => {
    type resChannels = {
      createMessage: Message;
    };
    const messageTitle = 'foo message';
    const data = await request<resChannels>(app.getHttpServer())
      .query(
        gql`
      mutation {
        createMessage(title: "${messageTitle}", content: "bar message", channelId: ${testChannelId},) {
          id
          title
          content
        }
      }
    `,
      )
      .expectNoErrors();
    expect(Array.isArray(data.data.createMessage)).toEqual(false);
    expect(data.data.createMessage.title).toEqual(messageTitle);
  });
  it('根据频道ID获取消息', async () => {
    type resChannels = {
      messages: [Message];
    };
    const data = await request<resChannels>(app.getHttpServer())
      .query(
        gql`
      query Query {
        messages(channelId: ${testChannelId}, offset:1, limit: 2) {
          title
          id
          content
          createdAt
        }
      }
    `,
      )
      .expectNoErrors();
    expect(Array.isArray(data.data.messages)).toEqual(true);
    expect(data.data.messages.length <= 2).toEqual(true);
  });
});
