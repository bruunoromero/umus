import diff from "virtual-dom/diff";
import patch from "virtual-dom/patch";
import createElement from "virtual-dom/create-element";
import { View as UmusView, Platform } from "@umus/common";

export * from "./attrs";
export * from "./events";
export * from "./html";

export type View<Msg> = UmusView<Msg, VirtualDOM.VNode>;

export class UmusDOM implements Platform<VirtualDOM.VNode, HTMLElement> {
  private tree?: VirtualDOM.VNode;
  private node?: Element;

  create(tree: VirtualDOM.VNode, el: HTMLElement) {
    this.tree = tree;
    this.node = createElement(this.tree);

    el.appendChild(this.node);
  }

  update(newTree: VirtualDOM.VNode) {
    if (this.tree && this.node) {
      const patches = diff(this.tree, newTree);
      this.node = patch(this.node, patches);
      this.tree = newTree;
    }
  }
}
