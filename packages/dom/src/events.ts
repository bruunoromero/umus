import { BoundUpdater } from "@umus/common";

export const onClick = <Msg>(msg: Msg) => {
  return {
    onclick: (updater: BoundUpdater<Msg>) => () => updater(msg),
  };
};

export const onInput = <Msg>(msg: (value: string) => Msg) => {
  return {
    oninput: (updater: BoundUpdater<Msg>) => (e: any) =>
      updater(msg(e.target.value)),
  };
};
