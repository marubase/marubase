export type ValueContract =
  | { [key: string]: ValueContract }
  | Date
  | Uint8Array
  | ValueContract[]
  | boolean
  | null
  | number
  | string
  | undefined;
