import Object from "./object"
import Pin from "./pin"
import { OneshotSender } from "./oneshot"

class Waker extends Object {
  #resolve?: Pin<OneshotSender<unknown>>
  register(resolve: OneshotSender<unknown>) {
    this.#resolve = Pin.pin(resolve)
  }
  wake() {
    this.#resolve?.unpin().send(true)
    this.#resolve = undefined
  }
  destructor() {
    this.#resolve?.unpin()
  }
}

export default Waker