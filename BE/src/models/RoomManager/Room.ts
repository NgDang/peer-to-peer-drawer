import { Room as RoomType, DrawingDataItem } from '../../types/room'
import User from '../UserManager/User'
import { User as UserType } from '../../types/user'
import MQTTService from '../MQTTSerivce';
import { MQTT_TOPIC } from '../../types/mqttSerivce'
import {dynamicTopic} from '../../utils/common'
class Room {
	private _id: string | undefined;
	private _code: number | undefined;
	private _name: string | undefined;
	private _owner: UserType | undefined;
	private _userList: Array<UserType> | undefined;
  private _drawingData: Array<DrawingDataItem> | undefined
  private _arrTopic: Array<string>

	constructor(data : RoomType) {
		this._id = data?.id;
		this._code = Math.floor(1000 + Math.random() * 9000);
		this._name = data?.name;
		this._owner = data?.owner;
		this._userList = data?.userList || [];
    this._drawingData = data?.drawingData || [];
    this._arrTopic = [
      dynamicTopic(MQTT_TOPIC.SEND_DRAWING, data?.id),
      dynamicTopic(MQTT_TOPIC.USER_SENDING_SIGNAL, data?.id),
      dynamicTopic(MQTT_TOPIC.USER_RETURNING_SIGNAL, data?.id),
    ]
    
    Promise.all(MQTTService.sub(this._arrTopic)).then(() => {
      console.log('Room create success, subsribe to topics');
      this.handleRoomTopic();
    }).catch(error => {
      console.log('Something went wrong');
    });

	}

	get id() {
    return this._id;
	}
	
	get code() {
    return this._code;
	}

  get name() {
    return this._name;
	}
	
	get owner() {
    return this._owner;
	}
	
	get userList() {
    return this._userList;
	}
	
	get drawingData() {
		return this._drawingData
	}

  get info() {
		return {
			id: this._id,
			code: this._code,
			name: this._name,
      owner: this._owner,
      userList: this._userList,
      drawingData: this._drawingData
		}
	}	

	setUserList(data: Array<UserType> | undefined) {
		this._userList = data;
  }
  setDrawingData(data: Array<DrawingDataItem> | undefined) {
		this._drawingData = data;
	}

	checkUserExist(userId: string) : boolean {
		const isExist = this.userList?.some(user => user.id === userId);
		return !!isExist;
	}

	join(user: User, code: number) {
		if (this.code === code && this.id) {
			user.joinRoom(this.id);
			const isExist : boolean = this.checkUserExist(user.id)
			if (!isExist) {
				this.userList?.push(user.info)
			}
			return true;
		} else {
			return false;
		}
	}

	leave(user: User) {
    if (user) {
      user.leaveRoom();
      const data = this.userList?.filter(item => item.id !== user.id)
      if (data?.length === 0) {
        this.setDrawingData([])
      }
			this.setUserList(data)
    }
	}

	updateDataDrawing(data : DrawingDataItem) {
    this.drawingData?.push(data)
	}
	
	remove() {
		this._id = undefined;
		this._code = undefined;
		this._name = undefined;
		this._owner = undefined;
		this._userList = undefined;
		this._drawingData = undefined;
  }
  
  handleRoomTopic() {
    MQTTService.handleTopic(this._arrTopic, (res: any, topic: string) => {
      const { payload } = res
      const roomId = payload.data?.roomId
			switch (topic) {
        case this._arrTopic[0]: {
          this.updateDataDrawing(payload.data) 
          const topic = dynamicTopic(MQTT_TOPIC.RECEIVE_DRAWING, this.id)
					MQTTService.pub(topic, {
						type: topic,
						payload: {
							message: `RECEIVE_DRAWING.`,
               data: this.info,
               callerId: this?.owner?.id
						}
					});
					break;
        }
        case this._arrTopic[1]: {
          const topic = dynamicTopic(MQTT_TOPIC.USER_JOIN, this.id, this?.owner?.id)
						MQTTService.pub(topic, {
							type: topic,
							payload: {
								message: `USER_JOIN.`,
                 data: payload.data,
                 callerId: this?.owner?.id
							}
						});
					break;
        }
        case this._arrTopic[2]: {
          const topic = dynamicTopic(MQTT_TOPIC.USER_RECEIVING_RETURNED_SIGNAL, this.id)
						MQTTService.pub(topic, {
							type: topic,
							payload: {
								message: `USER_RECEIVING_RETURNED_SIGNAL.`,
                 data: payload.data,
                 callerId: this?.owner?.id
							}
						});
						break;
          }
				}
				
    });
  }

}

export default Room;