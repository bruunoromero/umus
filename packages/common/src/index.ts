export type ClassOf<T> = { new (): T };

export type BoundUpdater<Msg> = (msg: Msg) => void;

export type View<Msg, RenderState> = (
  updater: BoundUpdater<Msg>
) => RenderState;

export type ViewCreator<Model, Msg, RenderState> = (
  model: Model
) => View<Msg, RenderState>;

export interface Platform<RenderState, Container> {
  create(state: RenderState, container: Container): void;
  update(state: RenderState): void;
}

export type UpdateFn<Model, Msg> = (model: Model, msg: Msg) => Model;
export type UpdateCmdFn<Model, Msg> = (
  model: Model,
  msg: Msg
) => [Model, PlatformCmd<Msg>];

export interface PlatformCmd<Msg> {
  receive(fn: (msg: Msg) => void): void;
}
