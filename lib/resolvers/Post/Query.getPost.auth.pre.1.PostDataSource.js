export function request(ctx) {
  return ctx.prev.result;
}

export function response(ctx) {
  return ctx.result;
}
