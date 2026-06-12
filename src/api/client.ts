import type {
  DrawRequest,
  DrawResponse,
  ScoreRequest,
  ScoreResponse,
  ValidateRequest,
  ValidateResponse,
} from "../../shared/types";

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path} failed: ${String(res.status)}`);
  return res.json() as Promise<T>;
}

export function draw(req: DrawRequest): Promise<DrawResponse> {
  return post<DrawResponse>("/api/draft/draw", req);
}

export function validate(req: ValidateRequest): Promise<ValidateResponse> {
  return post<ValidateResponse>("/api/squad/validate", req);
}

export function score(req: ScoreRequest): Promise<ScoreResponse> {
  return post<ScoreResponse>("/api/squad/score", req);
}
