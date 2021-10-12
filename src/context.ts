import Object from "./core/object"
import Pin from "./core/pin";
import Addr from "./addr"
import { EnvelopeProxy } from "./envelope"
import Mailbox from "./mailbox";
import Actor from "./actor";

export class Context extends Object {
  #mailbox: Pin<Mailbox>;
  constructor() {
    super()
    this.#mailbox = Pin.pin(Mailbox.default())
  }

  destructor() {
    this.#mailbox.unpin()
  }

  async #runRecv(act: Actor): Promise<void> {
    let env: EnvelopeProxy | undefined
    let pinner: Pin<Context> = Pin.pin(this)
    let actor: Pin<Actor> = Pin.pin(act)
    actor.ref().started(this)
    try {
      while (env = (await this.#mailbox.ref().nextMessage())) {
        try { env.handle(actor.ref(), this) }
        catch (error) { console.error(error) }
      }
    } finally {
      actor.ref().stopped(this)
      actor.unpin()
      pinner.unpin()
    }
  }

  run(act: Actor): Addr {
    this.#runRecv(act)
    return this.#mailbox.ref().address()
  }

  stop() {
    this.#mailbox.ref().close()
  }

  address(): Addr {
    return this.#mailbox.ref().address()
  }
}

export default Context