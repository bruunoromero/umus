import { merge, Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";

const none = new Subject<any>();
none.complete();

export class Sub {
  static none<Msg>() {
    return none as Subject<Msg>;
  }

  static batch<Msg>(subs: Observable<Msg>[]) {
    return merge(...subs);
  }

  static map<ChildMsg, ParentMsg>(
    sub: Observable<ChildMsg>,
    lift: (msg: ChildMsg) => ParentMsg
  ) {
    return sub.pipe(map(lift));
  }
}
