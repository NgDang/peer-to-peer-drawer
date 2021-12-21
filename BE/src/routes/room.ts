import { Router } from "express";
import RoomManager from "../models/RoomManager";
import UserManager from "../models/UserManager";
import { ERRORS } from "../constants/api";
import { ApiRequest, ApiResponse } from "../types/api";
import { Room, ApiGetRoomsResponse, ApiRoomResponse, ApiCreateRoomBody, ApiCreateRoomSuccess, ApiJoinRoomBody, ApiJoinRoomSuccess, ApiLeaveRoomBody, ApiLeftRoomSuccess, ApiDrawingBody, ApiDrawingSuccess } from '../types/room'

import MQTTService from '../models/MQTTSerivce'
import { MQTT_TOPIC } from "../types/mqttSerivce";

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

// Get detail room 
router.get('/:roomId', (
  req: ApiRequest<any, { roomId: string }>,
  res: ApiResponse<ApiRoomResponse>
) => {
  const { roomId } = req.params;
  console.log(roomId)
  const room = RoomManager.getRoom(roomId);
  if (!room) {
    return res.status(400).json({
      status: 'error',
      error: ERRORS.NOT_FOUND
    });
  }

  return res.json({
    status: 'success',
    data: {
      room: room.info,
    }
  })
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
      MQTTService.pub(MQTT_TOPIC.RELOAD_ROOM, {
        type: MQTT_TOPIC.RELOAD_ROOM,
        payload: {
          message: `${name} has created room.`,
        }
      });

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
  res: ApiResponse<any>,
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
  // Join room, send all user in room
  RoomManager.joinRoom(userId, roomId, code).then(() => {
    const room = RoomManager.getRoom(roomId);
    MQTTService.pub(MQTT_TOPIC.GET_USER_IN_ROOM, {
      type: MQTT_TOPIC.GET_USER_IN_ROOM,
      payload: {
        message: `Someone has jointed room.`,
        data: room?.userList
      }
    });

    return res.json({
      status: 'success',
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
