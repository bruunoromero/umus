import { button, div, input, mapMsg, text } from "./html";
import * as Umus from "./umus";

type Model = typeof init;

type Msg = { type: "increment" | "decrement" | "onInput"; [x: string]: any };
type InputMsg = { type: "change" };

const init = { count: 0 };

const Msg = {
  increment: (): Msg => ({ type: "increment" }),
  decrement: (): Msg => ({ type: "decrement" }),
  onInput: (msg: InputMsg): Msg => ({ type: "onInput", payload: msg }),
};

const InputMsg = {
  change: () => ({ type: "change" }),
};

const update = (model: Model, msg: Msg) => {
  console.log(msg);
  if (msg.type === "increment") {
    return { count: model.count + 1 };
  }

  if (msg.type === "decrement") {
    return { count: model.count - 1 };
  }

  if (msg.type === "onInput") {
    console.log("ola");
    return model;
  }

  return model;
};

const view = (model: Model) =>
  div({}, [
    button({ onclick: Msg.increment() }, [text("+")]),
    div({}, [text(model.count.toString())]),
    button({ onclick: Msg.decrement() }, [text("-")]),
    mapMsg<Msg, InputMsg>(
      div({}, [input({ oninput: InputMsg.change() }, [])]),
      Msg.onInput
    ),
  ]);

const app = Umus.create({
  init,
  update,
  view,
});

app.run({
  el: document.querySelector("#app"),
});
