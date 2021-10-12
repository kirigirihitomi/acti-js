import Object from "../core/object";

{
  let obj: any = new Object()
  obj.a = 100
  setTimeout(() => {
    try {
      obj.a
    } catch (error) {
      console.log(error)
    }
  }, 100);
}