import { Router } from "express";
import UserManager from '../models/UserManager'
import { ApiRequest, ApiResponse } from "../types/api";
import { RegisterSuccess, RegisterUserBody } from "../types/user";
import { ERRORS } from "../constants/api";

const router = Router();

// Get user detail
router.get('/:userId', (
	req: ApiRequest<{},{ userId: string }>,
  res: ApiResponse<any>
) => {
	const { userId } = req.params;
  res.json({
    status: 'success',
    data: {
      users: UserManager.getById(userId),
    }
  });
})

// Create user
router.post('/create', (
  req: ApiRequest<RegisterUserBody>,
  res: ApiResponse<RegisterSuccess>
) => {
  const { name } = req.body;

  if (UserManager.checkUserExist(name)) {
    return res.status(400).json({
      status: 'error',
      error: ERRORS.EXISTS
    });
  } else {
    const user = UserManager.addUser(name);
    res.json({
      status: 'success',
      data: {
        user
      }
    })
  }
})



export default router;
