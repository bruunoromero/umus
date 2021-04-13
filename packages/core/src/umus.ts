import * as _ from "lodash/fp";
import diff from "virtual-dom/diff";
import patch from "virtual-dom/patch";
import createElement from "virtual-dom/create-element";

type UmusOps<Model, Handlers> = {
  init: Model;
  update: Actions<Handlers, Model>;
  view: (
    model: Model,
    actions: {
      [K in keyof Handlers]: (model: Model) => Model;
    }
  ) => (model: Model) => VirtualDOM.VNode;
};

type Actions<T, M> = {
  [K in keyof T]: (model: M) => M;
};

type UmusAppOps = {
  el: HTMLElement | null;
};

export const create = <Model, Handlers>({
  view,
  init,
  update,
}: UmusOps<Model, Handlers>) => {
  let state = init;
  let tree: VirtualDOM.VNode;
  let node: Element;

  const keys = Object.keys(update);

  const boundUpdate = _.reduce(
    (acc, key) => {
      return _.update(
        key,
        (fn) => {
          return (model: Model) => {
            state = fn(model);

            if (tree && node) {
              const newTree = view(state, boundUpdate)(state);
              const patches = diff(tree, newTree);
              node = patch(node, patches);
              tree = newTree;
            }
          };
        },
        acc
      );
    },
    update,
    keys
  );

  return {
    run: ({ el }: UmusAppOps) => {
      if (el) {
        tree = view(state, boundUpdate)(state);
        node = createElement(tree);
        el.appendChild(node);
      }
    },
  };
};
