import React, {Dispatch} from "react";

export type FormElement = React.FormEvent<HTMLFormElement>;

export type OnClickEvent = React.MouseEvent<HTMLElement>;

export type OnClickCallback = (e: OnClickEvent) => void;

export type SetState<T> = Dispatch<T>;
