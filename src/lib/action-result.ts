export interface ActionResult<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}
