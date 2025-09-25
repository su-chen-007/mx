export interface Props {
  content: any;
  index: number;
}

export interface Emits {
  (e: "delete", data: number): void;
}
