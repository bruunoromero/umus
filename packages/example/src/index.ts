import {
  button,
  div,
  input,
  mapMsg,
  onClick,
  onInput,
  text,
  UmusDOM,
  value,
  View,
} from "@umus/dom";
import { Cmd, Umus, Sub } from "@umus/core";
import { Union, of } from "ts-union";
import { Record } from "immutable";

const makeModel = Record({ count: 0, value: "" });

const model = makeModel();

type Model = ReturnType<typeof makeModel>;

const Msg = Union({
  init: of(null),
  increment: of(null),
  decrement: of(null),
  onInput: of<InputMsg>(),
});

type Msg = typeof Msg.T;

const InputMsg = Union({
  change: of<string>(),
});

type InputMsg = typeof InputMsg.T;

const update = (model: Model, msg: Msg): [Model, Cmd<Msg>] =>
  Msg.match(msg, {
    init: () => [model.set("count", 10), Cmd.none()],
    increment: () => [model.update("count", (count) => count + 1), Cmd.none()],
    decrement: () => [model.update("count", (count) => count - 1), Cmd.none()],
    onInput: (msg) => [model.set("value", updateInput(msg)), Cmd.none()],
  });

const updateInput = (msg: InputMsg) =>
  InputMsg.match(msg, {
    change: (payload) => payload,
  });

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

const initComplete = Umus.port<Msg>();
const startInit = Umus.port<Msg>();

startInit.subscribe(() => {
  console.log("start called");
  setTimeout(() => {
    initComplete.next(Msg.init);
  }, 2000);
});

const app = Umus.bind(UmusDOM).element({
  init: [model, Cmd.fromPort<Msg>(startInit)],
  update,
  view,
  subscriptions: () => initComplete,
});

app.run({
  el: document.querySelector("#app"),
});
