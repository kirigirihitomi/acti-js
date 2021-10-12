import Addr from "./addr"
import Context from "./context"
import { Message } from "./message"


class Broker {
  #handlers: Map<Message, Set<Addr>> = new Map()
  subscribe(t: Message, context: Context) {
    if (!this.#handlers.has(t)) { this.#handlers.set(t, new Set()) }
    this.#handlers.get(t)?.add(context.address())
  }
  issue(msg: Message) {
    let t = msg.constructor
    let handlers = this.#handlers.get(t)
    handlers?.forEach(address => {
      address.send(msg).catch(_ => handlers?.delete(address))
    })
  }
}

export default new Broker()