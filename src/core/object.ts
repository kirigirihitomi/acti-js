class Object {
  #alive: boolean
  #pinner?: Promise<unknown>
  constructor(...args: any[]) {
    this.#alive = true;
    this.#construct() // start pin watcher
  }

  async #construct() {
    do {
      await Promise.resolve() // wait for next tick
      this._pinned && await this.#pinner  // wait if pinned
    } while (this._pinned); // if no more pinner release
    this.#destruct()
  }

  #destruct() {
    this.destructor()
    this.#alive = false
  }

  set _pinner(pinner: Promise<unknown> | undefined) { this.#pinner = pinner }
  get _pinned() { return this.#pinner }

  destructor() { } // for implement
} // todo: throw error on access properties after release 
export default Object