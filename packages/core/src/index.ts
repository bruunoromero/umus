import { value } from "./attrs";
import { onClick, onInput } from "./events";
import { button, div, input, mapMsg, text } from "./html";
import { create, View } from "./umus";

type Model = typeof init;

const init = { count: 0, value: "" };

type Msg =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "onInput"; payload: InputMsg };

const Msg = {
  increment: { type: "increment" } as Msg,
  decrement: { type: "decrement" } as Msg,
  onInput: (payload: InputMsg) => ({ type: "onInput", payload } as Msg),
};

type InputMsg = { type: "change"; payload: string };

const InputMsg = {
  change: (payload: string) => ({ type: "change", payload } as InputMsg),
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

const updateInput = (msg: InputMsg) => {
  if (msg.type === "change") {
    return msg.payload;
  }

  return "";
};

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
