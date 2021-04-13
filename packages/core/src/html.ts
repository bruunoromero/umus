import * as _ from "lodash/fp";
import h from "virtual-dom/h";
import { createProperties } from "virtual-dom";

type ElementBuilder<Model> = (model: Model) => VirtualDOM.VNode | string;

const makeElementBuilder = (tag: string) => {
  return <Model = any>(
    { onClick, ...attrs }: createProperties,
    children: ElementBuilder<Model>[]
  ) => (state: Model) => {
    const boundAttrs = _.mergeAll([attrs, { onclick: () => onClick?.(state) }]);
    const buildChildren = children.map((child) => child(state));

    return h(tag, boundAttrs, buildChildren);
  };
};

export const div = makeElementBuilder("div");
export const button = makeElementBuilder("button");
export const text = (content: string) => (_: any) => content;
