export type Observer<Msg> = (msg: Msg) => void;

export class Observable<T> {
  subscribers: Observer<T>[];

  constructor() {
    this.subscribers = [];
  }

  subscribe(handler: Observer<T>) {
    const unsubscribe = () => {
      const index = this.subscribers.indexOf(handler);
      this.subscribers.splice(index, 1);
    };

    this.subscribers.push(handler);

    return unsubscribe;
  }

  send(value: T) {
    this.subscribers.forEach((sub) => {
      sub(value);
    });
  }
}
