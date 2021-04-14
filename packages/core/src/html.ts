import * as _ from "lodash/fp";
import h from "virtual-dom/h";
import { BoundUpdater } from "./umus";

type ElementBuilder<Msg> = (
  updater: BoundUpdater<Msg>
) => VirtualDOM.VNode | string;

type AttributeName = "onclick" | "oninput" | "value";

type Attribute = Partial<Record<AttributeName, any>>;

const makeElementBuilder = (tag: string) => {
  return <Msg>(attrs: Attribute[], children: ElementBuilder<Msg>[]) => (
    updater: BoundUpdater<Msg>
  ) => {
    const mergedAttrs = _.mergeAll(attrs);

    const boundAttrs = _.mapValues((attr) => {
      if (attr instanceof Function) {
        return attr(updater);
      }
    }, mergedAttrs);

    const buildChildren = children.map((child) => child(updater));

    return h(tag, boundAttrs, buildChildren);
  };
};

const makeSelfClosingElementBuilder = (tag: string) => <Msg>(
  attrs: Attribute[]
) => makeElementBuilder(tag)<Msg>(attrs, []);

export const div = makeElementBuilder("div");
export const button = makeElementBuilder("button");
export const input = makeSelfClosingElementBuilder("input");
export const text = (content: string) => (_: any) => content;

export const mapMsg = <Msg, ChildMsg>(
  builder: ElementBuilder<ChildMsg>,
  parentMsg: (childMsg: ChildMsg) => Msg
): ElementBuilder<Msg> => {
  return (updater) => {
    return builder((msg) => updater(parentMsg(msg)));
  };
};
