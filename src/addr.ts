// import Object from "./core/object"
import { Sender } from "./channel"
import MessageBox, { Message } from "./message"

class Addr {
  #sender: Sender
  constructor(sender: Sender) {
    this.#sender = sender
  }

  send(msg: Message): Promise<unknown> {
    return this.#sender.send(new MessageBox(msg))
  }

  doSend(msg: Message) {
    this.#sender.doSend(new MessageBox(msg))
  }
}

export default Addr