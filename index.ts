export { default as Actor } from "./src/actor"
export { default as Addr } from "./src/addr"
export { default as Broker } from "./src/broker"
export { default as Context } from "./src/context"
export { default as Object } from "./src/core/object"
export { default as Pin } from "./src/core/pin"

import { Message as _Message } from "./src/message"
export type HandlerArray = Array<[_Message, (actor: any, msg: any, ctx: any) => Promise<unknown>]>
export class Message implements _Message {
  static new(args: object = {}): Message { return Object.assign(new this(), args) }
}