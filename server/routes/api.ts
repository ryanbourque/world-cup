import type { Router, Request, Response } from "express";
import type { DrawRequest, ValidateRequest, ScoreRequest } from "../../shared/types";
import { getDraw } from "../logic/draw";
import { scoreStarters } from "../logic/score";
import { validateSquad } from "../logic/validate";

export function setupRoutes(router: Router): void {
  router.get("/health", (req: Request, res: Response) => {
    res.json({ ok: true });
  });

  router.post("/draft/draw", (req: Request, res: Response) => {
    const body = req.body as DrawRequest;
    const response = getDraw(body);
    res.json(response);
  });

  router.post("/squad/validate", (req: Request, res: Response) => {
    const body = req.body as ValidateRequest;
    res.json(validateSquad(body));
  });

  router.post("/squad/score", (req: Request, res: Response) => {
    const body = req.body as ScoreRequest;
    const response = scoreStarters(body);
    res.json(response);
  });
}
