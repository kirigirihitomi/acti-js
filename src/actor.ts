import Object from "./core/object"
import Addr from "./addr"
import Context from "./context"
import { Message } from "./message"

type HandlerMap = Map<Message, (act: any, msg: any, ctx: any) => PromiseLike<any>>
class Actor extends Object {
  get handlers(): HandlerMap { return new Map() } // handlers for Message, implement by extends
  start(): Addr {
    return new Context().run(this)
  }
  started(ctx: Context) { } // implement by extends
  stopped(ctx: Context) { } // implement by extends
}

export default Actor
