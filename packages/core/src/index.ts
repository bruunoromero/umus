import { UmusUpdater } from "./updater";
import {
  ClassOf,
  ViewCreator,
  View,
  BoundUpdater,
  Platform,
  UpdateFn,
} from "@umus/common";

type UmusOps<Model, Msg, RenderState> = {
  init: Model;
  update: UpdateFn<Model, Msg>;
  view: ViewCreator<Model, Msg, RenderState>;
};

type UmusAppOps<Container> = {
  el: Container | null;
};

const createBoundUpdater = <RenderState, Container, Model, Msg>(
  platform: Platform<RenderState, Container>,
  updater: UmusUpdater<Model, Msg>,
  viewCreator: ViewCreator<Model, Msg, RenderState>
) => {
  const boundUpdate = (msg: Msg) => {
    const [shouldUpdate, model] = updater.update(msg);

    if (shouldUpdate) {
      const view = viewCreator(model);
      platform.update(view(boundUpdate));
    }
  };

  return boundUpdate;
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

  create<Model, Msg>({
    view: viewCreator,
    init,
    update,
  }: UmusOps<Model, Msg, RenderState>) {
    const updater = new UmusUpdater(init, update);
    const boundUpdate = createBoundUpdater(this.platform, updater, viewCreator);

    return new UmusApp(this.platform, viewCreator(init), boundUpdate);
  }
}

export class Umus {
  static bind<RenderState, Container>(
    ctor: ClassOf<Platform<RenderState, Container>>
  ) {
    const platform = new ctor();
    return new Creator(platform);
  }
}
