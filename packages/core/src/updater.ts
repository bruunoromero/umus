import { UpdateFn } from "@umus/common";

export class UmusUpdater<Model, Msg> {
  private states: Model[];

  constructor(init: Model, private readonly updateFn: UpdateFn<Model, Msg>) {
    this.states = [init];
  }

  private get state(): Model {
    return this.states[this.states.length - 1];
  }

  private set state(state: Model) {
    this.states.push(state);
  }

  update(msg: Msg): [boolean, Model] {
    const newState = this.updateFn(this.state, msg);

    if (newState !== this.state) {
      this.state = newState;
      return [true, this.state];
    }

    return [false, this.state];
  }
}
