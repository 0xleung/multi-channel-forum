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

#### 启动本地开发环境

启动本地数据库环境

```bash
make dataenv-up
mkdir -p $DATA_PATH/.data/mysql \
                $DATA_PATH/.data/redis \

docker compose --env-file $ENV_FILE -p $DEVENV_PROJECT_NAME -f docker-compose.yaml -f docker-compose.dataenv.yaml up -d mysql redis
WARN[0000] The "TIMEZONE" variable is not set. Defaulting to a blank string.
WARN[0000] The "TIMEZONE" variable is not set. Defaulting to a blank string.
[+] Running 2/0
 ⠿ Container multi-channel-forum-redis-1  Running
 ⠿ Container multi-channel-forum-mysql-1  Running
```

启动本地开发服务(graphql)

```bash
make run-local-graphql-server
source scripts/export-env.sh $ENV_FILE;\
        source scripts/export-env.sh $DEVENV_FILE;\
        npm start

> multi-channel-forum@0.0.1 start
> nest start

[Nest] 85715  - 2023/02/15 17:23:01     LOG [NestFactory] Starting Nest application...
[Nest] 85715  - 2023/02/15 17:23:01     LOG [InstanceLoader] TypeOrmModule dependencies initialized +38ms
[Nest] 85715  - 2023/02/15 17:23:01     LOG [InstanceLoader] GraphQLSchemaBuilderModule dependencies initialized +0ms
[Nest] 85715  - 2023/02/15 17:23:01     LOG [InstanceLoader] GraphQLModule dependencies initialized +0ms
[Nest] 85715  - 2023/02/15 17:23:01     LOG [InstanceLoader] TypeOrmCoreModule dependencies initialized +66ms
[Nest] 85715  - 2023/02/15 17:23:01     LOG [InstanceLoader] TypeOrmModule dependencies initialized +0ms
[Nest] 85715  - 2023/02/15 17:23:01     LOG [InstanceLoader] AppModule dependencies initialized +0ms
[Nest] 85715  - 2023/02/15 17:23:01     LOG [GraphQLModule] Mapped {/graphql, POST} route +219ms
[Nest] 85715  - 2023/02/15 17:23:01     LOG [NestApplication] Nest application successfully started +1ms

```

开发完成后关闭本地数据库环境

```bash
make dataenv-down
docker compose --env-file $ENV_FILE -p $DEVENV_PROJECT_NAME -f docker-compose.yaml -f docker-compose.dataenv.yaml down -v --remove-orphans
[+] Running 3/2
 ⠿ Container multi-channel-forum-redis-1 Removed
 ⠿ Container multi-channel-forum-mysql-1 Removed
 ⠿ Network multi-channel-forum_multi-channel-forum  Removed
```

##### 接口文档

graphql 自带文档属性, 在开发模式下打开了 `playground` 访问 `http://127.0.0.1:3000/graphql` 即可查看
![文档预览](https://raw.githubusercontent.com/0xleung/multi-channel-forum/main/doc/images/doc.png)

##### 测试

单元测试

```
make test-local-graphql-server
```

e2e 测试

```
make e2e-test-local-graphql-server
```

#### 启动生产环境

**_正式上生产环境前还需要在 ci 端更换掉敏感环境变量的值_**

启动

```
make up
```

关闭

```
make down
```

时间原因网关等相关 docker 和配置并没有加入项目,直接访问 3000 端口即可
