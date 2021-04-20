import { PlatformCmd } from "@umus/common";
import { from, Observable, Subject } from "rxjs";

export class Cmd<Msg> implements PlatformCmd<Msg> {
  private isSubscribed: boolean;

  constructor(private readonly observable: Observable<Msg | null>) {
    this.isSubscribed = false;
  }

  receive(fn: (msg: Msg) => any) {
    if (!this.isSubscribed) {
      this.isSubscribed = true;
      const unsubscriber = this.observable.subscribe((msgOrNull) => {
        this.isSubscribed = false;
        unsubscriber.unsubscribe();
        if (msgOrNull) {
          fn(msgOrNull);
        }
      });
    }
  }

  static from<Msg>(promise: Promise<Msg>) {
    return new Cmd(from(promise));
  }

  static fromPort<Msg>(port: Subject<Msg>, msg?: Msg) {
    const cmd = new Cmd<Msg>(port);
    port.next(msg);
    return cmd;
  }

  static none<Msg>() {
    return new Cmd(
      from(
        new Promise<Msg | null>((resolve) => {
          resolve(null);
        })
      )
    );
  }
}
