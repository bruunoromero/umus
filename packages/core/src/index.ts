import { value } from "./attrs";
import { onClick, onInput } from "./events";
import { button, div, input, mapMsg, text } from "./html";
import { create, View } from "./umus";

type Model = typeof init;

type Msg = { type: "increment" | "decrement" | "onInput"; [x: string]: any };
type InputMsg = { type: "change"; [x: string]: any };

const init = { count: 0, value: "" };

const Msg = {
  increment: { type: "increment" },
  decrement: { type: "decrement" },
  onInput: (msg: InputMsg): Msg => ({ type: "onInput", payload: msg }),
};

const InputMsg = {
  change: (value: string): InputMsg => ({ type: "change", payload: value }),
};

const update = (model: Model, msg: Msg) => {
  if (msg.type === "increment") {
    return { ...model, count: model.count + 1 };
  }

  if (msg.type === "decrement") {
    return { ...model, count: model.count - 1 };
  }

  if (msg.type === "onInput") {
    return { ...model, value: updateInput(msg.payload) };
  }

  return model;
};

function updateInput(msg: InputMsg) {
  if (msg.type === "change") {
    return msg.payload;
  }

  return "";
}

const view = (model: Model): View<Msg> =>
  div(
    [],
    [
      button([onClick(Msg.increment)], [text("+")]),
      div([], [text(model.count.toString())]),
      button([onClick(Msg.decrement)], [text("-")]),
      mapMsg(
        div([], [input([onInput(InputMsg.change), value(model.value)])]),
        Msg.onInput
      ),
      text(model.value),
    ]
  );

const app = create({
  init,
  update,
  view,
});

app.run({
  el: document.querySelector("#app"),
});
