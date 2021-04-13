import { button, div, text } from "./html";
import * as Umus from "./umus";

const init = { count: 0 };

type Model = typeof init;

const app = Umus.create({
  init,
  update: {
    increment: (model: Model) => ({ count: model.count + 1 }),
    decrement: (model: Model) => ({ count: model.count - 1 }),
  },
  view: (model, { increment, decrement }) =>
    div({}, [
      button({ onclick: increment }, [text("+")]),
      div({}, [text(model.count.toString())]),
      button({ onclick: decrement }, [text("-")]),
    ]),
});

app.run({
  el: document.querySelector("#app"),
});
