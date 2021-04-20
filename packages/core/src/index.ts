import { UmusUpdater } from "./updater";
import {
  ClassOf,
  ViewCreator,
  View,
  BoundUpdater,
  Platform,
  UpdateFn,
  UpdateCmdFn,
  PlatformCmd,
} from "@umus/common";
import { Subject, Subscribable } from "rxjs";
import { Cmd } from "./cmd";
import { Binder } from "./binder";
import { Sub } from "./sub";
export { Cmd } from "./cmd";
export { Sub } from "./sub";

type SandboxOps<Model, Msg, RenderState> = {
  init: Model;
  update: UpdateFn<Model, Msg>;
  view: ViewCreator<Model, Msg, RenderState>;
};

type ElementOps<Model, Msg, RenderState> = {
  init: [Model, PlatformCmd<Msg>];
  update: UpdateCmdFn<Model, Msg>;
  view: ViewCreator<Model, Msg, RenderState>;
  subscriptions: (model: Model) => Subscribable<Msg>;
};

type UmusAppOps<Container> = {
  el: Container | null;
};

class UmusApp<RenderState, Container, Msg> {
  constructor(
    private readonly platform: Platform<RenderState, Container>,
    private readonly view: View<Msg, RenderState>,
    private readonly boundUpdate: BoundUpdater<Msg>
  ) {}

  run({ el }: UmusAppOps<Container>) {
    if (el) {
      this.platform.create(this.view(this.boundUpdate), el);
    }
  }
}

class Creator<RenderState, Container> {
  constructor(private readonly platform: Platform<RenderState, Container>) {}

  sandbox<Model, Msg>({
    view: viewCreator,
    init,
    update,
  }: SandboxOps<Model, Msg, RenderState>) {
    const noneUpdate = (model: Model, msg: Msg): [Model, PlatformCmd<Msg>] => [
      update(model, msg),
      Cmd.none<Msg>(),
    ];

    const updater = new UmusUpdater([init, Cmd.none<Msg>()], noneUpdate);
    const binder = new Binder(init, this.platform, updater, viewCreator, () =>
      Sub.none<Msg>()
    );

    return new UmusApp(this.platform, viewCreator(init), binder.update);
  }

  element<Model, Msg>({
    view: viewCreator,
    init,
    update,
    subscriptions,
  }: ElementOps<Model, Msg, RenderState>) {
    const [model] = init;
    const updater = new UmusUpdater(init, update);
    const binder = new Binder(
      model,
      this.platform,
      updater,
      viewCreator,
      subscriptions
    );

    return new UmusApp(this.platform, viewCreator(model), binder.update);
  }
}

export class Umus {
  static bind<RenderState, Container>(
    ctor: ClassOf<Platform<RenderState, Container>>
  ) {
    const platform = new ctor();
    return new Creator(platform);
  }

  static port<Msg>() {
    return new Subject<Msg>();
  }
}
