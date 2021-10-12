import Object from "./object"

class _Pin<T extends Object> {
  #value: T
  #resolve?: (value: void) => void
  constructor(obj: T) {
    this.#value = obj
  }

  static pin<T extends Object>(obj: T): _Pin<T> {
    if (obj._pinned) throw new Error("Object has been pinned");
    let pin = new _Pin<T>(obj)
    obj._pinner = new Promise(resolve => pin.#resolve = resolve)
    return pin
  } // set pinner

  unpin(): T {
    this.#resolve?.apply(this);
    this.#value._pinner = undefined
    return this.#value
  }

  ref(): T { // ts compatiblity for pin proxy
    return this.#value
  }
}

const ProxyPin = new Proxy(_Pin, {
  construct() { throw new Error("Cannot call new Pin directly"); }
})

class Pin<T extends Object> extends ProxyPin<T> { }
export default Pin