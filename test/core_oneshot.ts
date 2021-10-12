import oneshotChannel from "../core/oneshot"

console.log("oneshot with send")
{
  let [tx, rx] = oneshotChannel<string>()
  rx.recv().then(console.log).catch(console.warn)
  tx.send("")
}

console.log("oneshot with no send")
{
  let [tx, rx] = oneshotChannel()
  rx.recv().catch(console.warn)
}