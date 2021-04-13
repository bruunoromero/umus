import * as _ from "lodash/fp";
import h from "virtual-dom/h";
import { createProperties } from "virtual-dom";

const makeElementBuilder = (tag: string) => {
  return (attrs: createProperties, children: (VirtualDOM.VNode | string)[]) => {
    return h(tag, attrs, children);
  };
};

export const div = makeElementBuilder("div");
export const button = makeElementBuilder("button");
export const text = (content: string) => content;
