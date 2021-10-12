import Object from "./core/object"
class MessageBox extends Object {
  #message: Message
  constructor(message: Message) {
    super()
    this.#message = message
  }

  get message(): Message {
    return this.#message
  }
}
export interface Message { }
export default MessageBox