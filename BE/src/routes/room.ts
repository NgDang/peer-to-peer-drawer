import { Router } from "express";
import RoomManager from "../models/RoomManager";
import UserManager from "../models/UserManager";
import { ERRORS } from "../constants/api";
import { ApiRequest, ApiResponse } from "../types/api";
import { Room, ApiGetRoomsResponse, ApiCreateRoomBody, ApiCreateRoomSuccess, ApiJoinRoomBody, ApiJoinRoomSuccess, ApiLeaveRoomBody, ApiLeftRoomSuccess, ApiDrawingBody, ApiDrawingSuccess } from '../types/room'

const router = Router();

// Get all rooms 
router.get('/', (
  req: ApiRequest<any>,
  res: ApiResponse<ApiGetRoomsResponse>
) => {
  const roomList: ApiGetRoomsResponse = {
    status: 'success',
    data: {
      roomList: RoomManager.getRoomList()
    }
  }
  res.json(roomList);
})

// Create Room
router.post('/create', (
  req: ApiRequest<ApiCreateRoomBody>,
  res: ApiResponse<ApiCreateRoomSuccess>
) => {
  const { name, userId } = req.body;
  if (RoomManager.checkRoomExist(name)) {
    return res.status(400).json({
      status: 'error',
      error: ERRORS.EXISTS,
    });
  } else {
    RoomManager.createRoom(name, userId).then((room: Room | undefined) => {
      const response: ApiCreateRoomSuccess = { status: 'success', data: { room } };
      res.json(response);
    }).catch(error => {
      return res.status(400).json({
        status: 'error',
        error: ERRORS.NOT_FOUND,
      });
    })
  }
});

// User join room
router.post('/join/:roomId', (
  req: ApiRequest<ApiJoinRoomBody, { roomId: string }>,
  res: ApiResponse<ApiJoinRoomSuccess>,
) => {
  const { code, userId } = req.body;
  const { roomId } = req.params;

  const room = RoomManager.getRoom(roomId);
  if (!room) {
    return res.status(400).json({
      status: 'error',
      error: ERRORS.NOT_FOUND
    });
  }

  if (room.checkUserExist(userId)) {
    return res.status(403).json({
      status: 'error',
      error: ERRORS.EXISTS
    });
  }
  // Join room
  RoomManager.joinRoom(userId, roomId, code).then(() => {
    const room = RoomManager.getRoom(roomId);
    return res.json({
      status: 'success',
      data: {
        userList: room ? room.userList : [],
        drawingData: room ? room.drawingData : []
      }
    })
  }).catch((errors) => {
    return res.status(400).json({
      status: "error",
      error: ERRORS.BAD_REQUEST,
    })
  });
});

router.post('/leave/:roomId', (
  req: ApiRequest<ApiLeaveRoomBody, { roomId: string }>,
  res: ApiResponse<ApiLeftRoomSuccess>,
) => {
  const { userId } = req.body;
  const { roomId } = req.params;

  if (!UserManager.getById(userId)) {
    return res.status(400).json({
      status: 'error',
      error: ERRORS.NOT_FOUND
    })
  }

  const room = RoomManager.getRoom(roomId);
  if (room) {
    RoomManager.leaveRoom(userId, roomId).then(() => {
      res.json({
        status: 'success',
        data: null,
      });
    }).catch(errCode => {
      return res.status(400).json({
        status: "error",
        error: ERRORS.BAD_REQUEST
      })
    });
  } else {
    return res.status(400).json({
      status: "error",
      error: ERRORS.BAD_REQUEST,
    })
  }
})

router.post('/drawing/:roomId', (
  req: ApiRequest<ApiDrawingBody, { roomId: string }>,
  res: ApiResponse<ApiDrawingSuccess>,
) => {
  const { userId, drawingDataItem } = req.body;
  const { roomId } = req.params;

  if (!UserManager.getById(userId)) {
    return res.status(400).json({
      status: 'error',
      error: ERRORS.NOT_FOUND
    })
  }

  const room = RoomManager.getRoom(roomId);
  if (room) {
    RoomManager.drawing(roomId, userId, drawingDataItem!).then((drawingData) => {
      res.json({
        status: 'success',
        data: {
          userId,
          drawingData
        }
      });
    }).catch(errCode => {
      return res.status(400).json({
        status: "error",
        error: ERRORS.BAD_REQUEST
      })
    });
  } else {
    return res.status(400).json({
      status: "error",
      error: ERRORS.BAD_REQUEST,
    })
  }
})



export default router;
