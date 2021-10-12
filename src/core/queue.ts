import Pin from "./pin"
import Object from "./object"

class Queue<T extends Object> extends Object {
  #values?: Array<Pin<T>>
  constructor() {
    super();
    this.#values = []
  }
  destructor() {
    this.#values?.forEach(element => element.unpin());
    this.#values = undefined
  }
  enqueue(value: T) {
    this.#values?.push(Pin.pin(value))
  }
  dequeue(): T | undefined {
    return this.#values?.shift()?.unpin()
  }
  get length(): number {
    return this.#values?.length || 0
  }
} // a queue for Object

export default Queue