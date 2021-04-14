import * as _ from "lodash/fp";
import diff from "virtual-dom/diff";
import patch from "virtual-dom/patch";
import createElement from "virtual-dom/create-element";

export type Updater<Model, Msg> = (model: Model, msg: Msg) => Model;
export type BoundUpdater<Msg> = (msg: Msg) => void;

type UmusOps<Model, Msg> = {
  init: Model;
  update: Updater<Model, Msg>;
  view: (
    model: Model
  ) => (
    updater: BoundUpdater<Msg>,
    mapWith: (a: any) => any
  ) => VirtualDOM.VNode;
};

type UmusAppOps = {
  el: HTMLElement | null;
};

export const create = <Model, Msg>({
  view,
  init,
  update,
}: UmusOps<Model, Msg>) => {
  let state = init;
  let tree: VirtualDOM.VNode;
  let node: Element;

  const boundUpdate = (msg: Msg) => {
    const newState = update(state, msg);

    if (tree && node && newState !== state) {
      state = newState;
      const newTree = view(state)(boundUpdate, _.identity);
      const patches = diff(tree, newTree);
      node = patch(node, patches);
      tree = newTree;
    }
  };

  return {
    run: ({ el }: UmusAppOps) => {
      if (el) {
        tree = view(state)(boundUpdate, _.identity);
        node = createElement(tree);
        el.appendChild(node);
      }
    },
  };
};
