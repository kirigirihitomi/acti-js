import Object from "../core/object"
import Queue from "../core/queue"
import Pin from "../core/pin";

{
  let obj = new Object()
  let queue = new Queue()
  console.log(queue)

  let pin = Pin.pin(queue)
  pin.ref().enqueue(obj)
  setTimeout(() => {
    console.log(queue.dequeue())
    console.log(queue.dequeue())
    pin.unpin()
  }, 100);
}