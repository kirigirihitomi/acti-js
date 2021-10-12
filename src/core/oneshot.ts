import Object from "./object"

export class OneshotSender<T> extends Object {
  #resolve: (arg: T) => void
  #reject: (arg: any) => void
  constructor(resolve: (arg: T) => void, reject: (arg: any) => void) {
    super()
    this.#resolve = resolve
    this.#reject = reject
  }
  send(msg: T) {
    this.#resolve(msg) // if message send, call and release receiver
  }
  destructor() {
    this.#reject(undefined) // if sender released, release receiver
  }
}

export class OneshotReceiver<T> {
  #promise: Promise<T>
  constructor(recv: Promise<T>) {
    this.#promise = recv
  }
  recv(): Promise<T> {
    return this.#promise // wait for sender send message
  }
}

export default function oneshotChannel<T>(): [OneshotSender<T>, OneshotReceiver<T>] {
  let resolve: (arg: T) => void = () => { };
  let reject: (arg: T) => void = () => { };
  let promise = new Promise<T>((res, rej) => { resolve = res; reject = rej; }) // create a promise for sender-receiver connection
  return [new OneshotSender(resolve, reject), new OneshotReceiver(promise)]
}
