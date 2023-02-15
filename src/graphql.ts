
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum CacheControlScope {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE"
}

export interface Channel {
    id: string;
    name: string;
}

export interface Message {
    id: string;
    title: string;
    content: string;
    channel: Channel;
    createdAt: string;
}

export interface IQuery {
    channels(offset?: Nullable<number>, limit?: Nullable<number>): Channel[] | Promise<Channel[]>;
    messages(channelId: string, offset?: Nullable<number>, limit?: Nullable<number>): Message[] | Promise<Message[]>;
}

export interface IMutation {
    createChannel(name: string): Channel | Promise<Channel>;
    createMessage(title: string, content: string, channelId: string): Message | Promise<Message>;
}

type Nullable<T> = T | null;
