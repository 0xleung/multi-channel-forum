# 多频道消息服务

## 需求

Create a multi-channel forum api. Can use any stack, but must use typescript, be deployable, and of production quality. Try using graphql or grpc for fun, but REST is ok too. Try using docker containers for fun if you want. Show how you would like to write documentation and testing if possible.

Channel Model: { id, name }

Message Model: { id, title, content, channel, createdAt }

The API should have these features.

create a channel
write messages in a channel
list messages in a channel and order by descending (pagination is a extra credit)
Show how a production level project would look. (documentation, testing, error handling, etc ...)

Send the repository link of the project by email when finished.

[https://gist.github.com/skylinezum/fb789509faea5dda4442e4d7dfe1342f](https://gist.github.com/skylinezum/fb789509faea5dda4442e4d7dfe1342f)

## 相关技术栈

1. 语言 node.js,ts
1. 服务框架 nest.js apollo graphql
1. 数据库使用 mysql
1. orm 使用 typeorm
1. 缓存使用 redis
1. 使用 docker 容器和用 compose 来管理编排容器
1. 使用 cmake 管理构建和常用命令
1. 使用 husky 检查规范提交代码和提交消息
1. 使用 jest 做单元测试和 e2e 测试

## 开始开发

### 环境依赖

1. docker
1. docker-compose
1. node.js
1. cmake

### 初始化
