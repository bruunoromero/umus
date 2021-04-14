import * as _ from "lodash/fp";
import h from "virtual-dom/h";
import { createProperties } from "virtual-dom";
import { BoundUpdater } from "./umus";

type ElementBuilder<Msg> = (
  updater: BoundUpdater<Msg>
) => VirtualDOM.VNode | string;

const makeElementBuilder = (tag: string) => {
  return <Msg>(
    { onclick, oninput, ...attrs }: createProperties,
    children: ElementBuilder<Msg>[]
  ) => (updater: BoundUpdater<Msg>) => {
    const boundAttrs = _.mergeAll([
      attrs,
      {
        onclick: () => {
          if (onclick) {
            updater(onclick);
          }
        },
        oninput: () => {
          if (oninput) {
            updater(oninput);
          }
        },
      },
    ]);

    const buildChildren = children.map((child) => child(updater));

    return h(tag, boundAttrs, buildChildren);
  };
};

export const div = makeElementBuilder("div");
export const input = makeElementBuilder("input");
export const button = makeElementBuilder("button");
export const text = (content: string) => (_: any) => content;

export const mapMsg = <Msg, ChildMsg>(
  builder: ElementBuilder<ChildMsg>,
  parentMsg: (childMsg: ChildMsg) => Msg
): ElementBuilder<Msg> => {
  return (updater) => {
    return builder((msg) => updater(parentMsg(msg)));
  };
};
