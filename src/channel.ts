import Pin from "./core/pin"
import Queue from "./core/queue"
import Object from "./core/object"
import Waker from "./core/waker"
import oneshotCannel from "./core/oneshot"
import Envelope, { EnvelopeProxy } from "./envelope"
import MessageBox from "./message"

class Inner extends Object {
  #messageQueue: Pin<Queue<Envelope>>
  #waker: Pin<Waker>
  constructor() {
    super()
    this.#messageQueue = Pin.pin(new Queue<Envelope>())
    this.#waker = Pin.pin(new Waker)
  }
  destructor() {
    this.#messageQueue.unpin()
    this.#waker.unpin()
  }
  get recvTask(): Waker { return this.#waker.ref() }
  get messageQueue(): Queue<Envelope> { return this.#messageQueue.ref() }
}

export class Sender extends Object {
  #inner: Inner
  constructor(inner: Inner) {
    super();
    this.#inner = inner
  }

  send(msg: MessageBox): Promise<unknown> {
    let [tx, rx] = oneshotCannel()
    let env = new Envelope(msg, tx)
    this.#inner.messageQueue.enqueue(env)
    this.#inner.recvTask.wake()
    return rx.recv()
  }

  doSend(msg: MessageBox) {
    let env = new Envelope(msg, undefined)
    this.#inner.messageQueue.enqueue(env)
    this.#inner.recvTask.wake()
  }
}

export class Receiver extends Object {
  #inner: Pin<Inner>
  #completed: boolean

  constructor(inner: Inner) {
    super();
    this.#completed = false
    this.#inner = Pin.pin(inner)
  }

  destructor() {
    this.#inner.unpin()
  }

  sender(): Sender {
    return new Sender(this.#inner.ref())
  }

  async recv(): Promise<EnvelopeProxy | undefined> {
    let env = this.#inner.ref().messageQueue.dequeue()
    if (env) return env.toProxy() // if there are some message in the queue return

    let [tx, rx] = oneshotCannel()
    this.#inner.ref().recvTask.register(tx)
    env = await rx.recv() && this.#inner.ref().messageQueue.dequeue()
    return this.#completed ? undefined // return undefined if recv completed
      : env?.toProxy() // return the message after singal receives
  }

  async complete() {
    this.#completed = true
    await Promise.resolve()
    this.#inner.ref().recvTask.wake()
  }
}

export default function channel(): [Sender, Receiver] {
  let inner = new Inner()
  return [new Sender(inner), new Receiver(inner)]
}
