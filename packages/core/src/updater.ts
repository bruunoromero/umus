import { PlatformCmd, UpdateCmdFn } from "@umus/common";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";


type Subscriber<Model> = (result: [boolean, Model]) => void;

export class UmusUpdater<Model, Msg> {
  private states: Model[];
  private subject: Subject<Msg>;
  private observable: Observable<[boolean, Model]>;

  constructor(
    [init, cmd]: [Model, PlatformCmd<Msg>],
    private readonly updateFn: UpdateCmdFn<Model, Msg>
  ) {
    this.subject = new Subject();
    this.observable = this.subject.pipe(map((msg) => this.update(msg)));
    this.states = [init];
    this.receive(cmd);
  }

  private get state(): Model {
    return this.states[this.states.length - 1];
  }

  private set state(state: Model) {
    this.states.push(state);
  }

  private receive(cmd: PlatformCmd<Msg>) {
    cmd.receive((msg: Msg) => this.next(msg));
  }

  private update(msg: Msg): [boolean, Model] {
    const [newState, cmd] = this.updateFn(this.state, msg);

    if (newState !== this.state) {
      this.state = newState;

      this.receive(cmd);

      return [true, newState];
    }

    this.receive(cmd);

    return [false, this.state];
  }

  subscribe(subscriber: Subscriber<Model>) {
    return this.observable.subscribe({
      next: subscriber,
    });
  }

  next(msg: Msg) {
    this.subject.next(msg);
  }
}
