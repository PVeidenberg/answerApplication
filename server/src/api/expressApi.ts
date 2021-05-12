import { Router } from "express";

import { SessionApi } from "../../../shared/Api";
import { userService } from "../services/userService";

const router = Router();

router.get<unknown, SessionApi>("/session", (req, res) => {
  if (!req.session.user) {
    req.session.user = userService.createUser();
  }

  res.send({
    roomCode: req.session.roomCode,
    role: req.session.role,
  });
});

export const expressApi = router;
