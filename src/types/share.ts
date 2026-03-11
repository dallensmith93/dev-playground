export type SharePayload = {
  tool: string;
  result: string;
};

export type DecodedShareResult = {
  ok: boolean;
  payload?: SharePayload;
  error?: string;
};
