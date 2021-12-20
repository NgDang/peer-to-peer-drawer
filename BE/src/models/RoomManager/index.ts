
import Room from './Room';
import {Room as RoomType, DrawingDataItem} from '../../types/room'
import { ERRORS } from './../../constants/api';
import UserManager from "../UserManager";
import { v4 as uuid } from "uuid";

class RoomManager {
	private roomList:  Array<Room>
	constructor() {
		this.roomList = [];
	}

	getRoomList(): RoomType[] {
		const data: RoomType[] = [];
    this.roomList.forEach((room: Room) => {
			data.push(room.info)
    })
		return data
  }
  checkRoomExist(name: string): boolean {
		return this.roomList.some(room => room.name === name)
	}

	getRoom(id: string) {
    return this.roomList.find(room => room.id === id);
	}

	createRoom(name: string, userId: string) {
		return new Promise<RoomType | undefined>((resolve, reject) => {
      const user = UserManager.getById(userId);
      
      if (user) {
				const id = uuid();
				const roomData : RoomType = {id, name, owner : user.info}
				const room = new Room(roomData);
				this.roomList.push(room)
        resolve(roomData);
      } else {
        reject();
      }
    })
	}
	joinRoom(userId: string, roomId: string, code: number) {
    return new Promise((resolve, reject) => {
      const user = UserManager.getById(userId);
      if (user) {
        let success;
        const room = this.getRoom(roomId);
				success = room?.join(user, code);
        success ? resolve('success') : reject(ERRORS.BAD_REQUEST);
      } else {
        reject(ERRORS.EXISTS);
      }
    })
	}
	
	leaveRoom(userId: string, roomId: string) {
    return new Promise((resolve, reject) => {
      const room = this.getRoom(roomId);
      if (!room?.checkUserExist(userId)) {
        reject(ERRORS.NOT_FOUND);
      } else {
        const user = UserManager.getById(userId);
        user && room?.leave(user);
        resolve("success");
      }
    });
	}

	drawing(roomId: string, userId: string, drawingDataItem : DrawingDataItem) {
    return new Promise((resolve, reject) => {
      const room = this.getRoom(roomId);
      if (!room?.checkUserExist(userId)) {
        reject(ERRORS.NOT_FOUND);
      } else {
        const user = UserManager.getById(userId);
        user && room.updateDataDrawing(drawingDataItem);
        resolve(room.drawingData);
      }
    });
	}

	
}
export default new RoomManager()