import Pin from "../core/pin";
import Object from "../core/object";

{
  let obj: any = new Object()
  obj.a = 100
  let pin = Pin.pin(obj)
  setTimeout(() => {
    console.log(obj.a, pin.ref().a)
    pin.unpin()
    setTimeout(() => {
      try {
        obj.a
        pin.ref().a
      } catch (error) {
        console.log(error)
      }
    }, 100);
  }, 100);
}