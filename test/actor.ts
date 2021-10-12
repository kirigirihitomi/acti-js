import * as acti from "../index"

class TestMessage implements acti.Message {
  index = 1
}

class TestMessage2 implements acti.Message {
  index = 2
}

class TestMessage3 implements acti.Message {
  index = 3
}

class Manager extends acti.Actor {
  get handlers() { return new Map(this.#handlers) }
  #handlers: acti.HandlerArray = [
    [TestMessage, this.handleMessage1],
    [TestMessage2, this.handleMessage2],
    [TestMessage3, this.handleMessage3],
  ]

  async handleMessage1(msg: TestMessage, ctx: acti.Context) {
    console.log(msg)
  }

  async handleMessage2(msg: TestMessage2, ctx: acti.Context) {
    console.log(msg)
    acti.Broker.issue(new TestMessage3())
  }

  async handleMessage3(msg: TestMessage2, ctx: acti.Context) {
    console.log(msg)
    ctx.stop()
  }

  started(ctx: acti.Context) {
    console.log(ctx.address())
    acti.Broker.subscribe(TestMessage3, ctx)
  }
  stopped(ctx: acti.Context) {
    console.log(ctx.address())
  }
}

class Manager2 extends acti.Actor {
  get handlers() { return new Map(this.#handlers) }
  #handlers: acti.HandlerArray = [
    [TestMessage, this.handleMessage1],
    [TestMessage2, this.handleMessage2],
    [TestMessage3, this.handleMessage3],
  ]

  async handleMessage1(actor: this, msg: TestMessage, ctx: acti.Context) {
    console.log(msg)
  }

  async handleMessage2(actor: this, msg: TestMessage2, ctx: acti.Context) {
    console.log(msg)
    acti.Broker.issue(new TestMessage3())
  }

  async handleMessage3(actor: this, msg: TestMessage2, ctx: acti.Context) {
    console.log(msg)
    ctx.stop()
  }

  started(ctx: acti.Context) {
    console.log(ctx.address())
    acti.Broker.subscribe(TestMessage3, ctx)
  }
  stopped(ctx: acti.Context) {
    console.log(ctx.address())
  }
}

let addr = new Manager().start()
let addr2 = new Manager2().start()
setTimeout(() => {
  addr.doSend(new TestMessage())
  addr.doSend(new TestMessage2())
}, 1000);

setTimeout(() => {
  addr.doSend(new TestMessage2())
  acti.Broker.issue(new TestMessage3())
  setTimeout(() => console.log(acti.Broker), 1000);
}, 2000);
