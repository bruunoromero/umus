import { Platform, ViewCreator } from "@umus/common";
import { Subscribable, Unsubscribable } from "rxjs";
import { UmusUpdater } from "./updater";

type SubCreator<Model, Msg> = (model: Model) => Subscribable<Msg>;

export class Binder<RenderState, Container, Model, Msg> {
  private sub?: Unsubscribable;
  constructor(
    readonly initModel: Model,
    private readonly platform: Platform<RenderState, Container>,
    private readonly updater: UmusUpdater<Model, Msg>,
    private readonly viewCreator: ViewCreator<Model, Msg, RenderState>,
    private readonly subCreator: SubCreator<Model, Msg>
  ) {
    this.subscribe(initModel);
    updater.subscribe(([shouldRender, model]) => {
      if (shouldRender) {
        const view = this.viewCreator(model);
        this.platform.update(view(this.update));

        this.subscribe(model);
      }
    });
  }

  private subscribe(model: Model) {
    if (this.sub) {
      this.sub?.unsubscribe();
    }

    this.sub = this.subCreator(model).subscribe((msg) => this.update(msg));
  }

  update = (msg: Msg) => {
    this.updater.next(msg);
  };
}
