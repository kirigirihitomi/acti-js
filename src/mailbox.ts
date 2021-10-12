import Object from "./core/object"
import Pin from "./core/pin";

import Addr from "./addr"
import { EnvelopeProxy } from "./envelope"
import channel, { Receiver } from "./channel";

class Mailbox extends Object {
  #receiver: Pin<Receiver>
  constructor(receiver: Receiver) {
    super()
    this.#receiver = Pin.pin(receiver)
  }

  destructor() {
    this.#receiver.unpin()
  }

  address(): Addr {
    return new Addr(this.#receiver.ref().sender())
  }

  static default(): Mailbox {
    let [_, receiver] = channel()
    return new Mailbox(receiver)
  }

  nextMessage(): Promise<EnvelopeProxy | undefined> {
    return this.#receiver.ref().recv()
  }

  close() {
    this.#receiver.ref().complete()
  }
}

export default Mailbox