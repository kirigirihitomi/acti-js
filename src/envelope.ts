import Pin from "./core/pin"
import Object from "./core/object"
import { OneshotSender } from "./core/oneshot"
import Actor from "./actor"
import MessageBox, { Message } from "./message"
import Context from "./context"

export class EnvelopeProxy extends Object {
  #message?: Pin<MessageBox>
  #sender?: Pin<OneshotSender<MessageBox>>
  #pin?: Pin<this>
  constructor(msg: MessageBox, sender?: OneshotSender<MessageBox>) {
    super()
    this.#message = Pin.pin(msg)
    this.#sender = sender && Pin.pin(sender)
  }
  destructor() {
    this.#message?.unpin()
    this.#sender?.unpin()
  }

  async handle(actor: Actor, ctx: Context): Promise<any> {
    let result
    let msg = (this.#message?.ref() as any)?.message as Message
    let handler = actor.handlers.get(msg.constructor as Message)
    if (handler) {
      result = await handler.bind(actor)(actor, msg, ctx)
      this.#sender?.ref().send(result)
    }
    else {
      await Promise.resolve()
    }
    this.unpin()
    return result
  }

  pin(): this {
    this.#pin = Pin.pin(this)
    return this
  }

  unpin(): this {
    this.#pin?.unpin()
    return this
  }
}

class Envelope extends Object {
  #proxy?: EnvelopeProxy
  constructor(msg: MessageBox, sender?: OneshotSender<MessageBox>) {
    super()
    this.#proxy = new EnvelopeProxy(msg, sender).pin()
  }

  destructor() {
    this.#proxy?.unpin()
  }

  toProxy(): EnvelopeProxy | undefined {
    let proxy = this.#proxy
    this.#proxy = undefined
    return proxy
  }
}

export default Envelope