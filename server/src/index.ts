import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroConfig from './mikro-orm.config';
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';

import { createClient } from 'redis';
import { MyContext } from './types';

import express from 'express';
import session from 'express-session';
declare module 'express-session' {
  export interface SessionData {
    userId: number,
  }
}


let RedisStore = require('connect-redis')(session);
let redisClient = createClient({ legacyMode: true });
redisClient.connect().catch(console.error);

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up(); // migrate the database 

  const app = express();

  app.use(
    session({
      name: 'qid',
      store: new RedisStore({ 
        client: redisClient,
        disableTouch: true
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        secure: __prod__, // cookie only works in https
        sameSite: 'lax', // csrf
      },
      saveUninitialized: false,
      secret: "alkjdflkajelkfjaioflkadjslfk",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('Server started on localhost:4000');
  });
};

main().catch(err => {
  console.error(err);
});