import { Room as RoomType, DrawingDataItem } from '../../types/room'
import User from '../UserManager/User'
import { User as UserType } from '../../types/user'
import MQTTService from '../MQTTSerivce';
import { MQTT_TOPIC } from '../../types/mqttSerivce'

class Room {
	private _id: string | undefined;
	private _code: number | undefined;
	private _name: string | undefined;
	private _owner: UserType | undefined;
	private _userList: Array<UserType> | undefined;
	private _drawingData: Array<DrawingDataItem> | undefined

	constructor(data : RoomType) {
		this._id = data?.id;
		this._code = Math.floor(1000 + Math.random() * 9000);
		this._name = data?.name;
		this._owner = data?.owner;
		this._userList = data?.userList || [];
    this._drawingData = data?.drawingData;
    
    Promise.all(MQTTService.sub([
      MQTT_TOPIC.USER_SENDING_SIGNAL,
      MQTT_TOPIC.USER_RETURNING_SIGNAL
    ])).then(() => {
      console.log('Room create success, subsribe to topics');
      this.handleMessage();
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
      userList: this._userList
		}
	}	

	setUserList(data: Array<UserType> | undefined) {
		this._userList = data;
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
  
  handleMessage() {
    MQTTService.handleTopic([
      MQTT_TOPIC.USER_SENDING_SIGNAL,
      MQTT_TOPIC.USER_RETURNING_SIGNAL,
    ], (data: any, topic: string) => {
      switch (topic) {
        case MQTT_TOPIC.USER_SENDING_SIGNAL:
          MQTTService.pub(MQTT_TOPIC.USER_JOIN, {
            type: MQTT_TOPIC.USER_JOIN,
            payload: {
              message: `Someone has jointed room.`,
              data
            }
          });
          break;
          case MQTT_TOPIC.USER_RETURNING_SIGNAL:
            MQTTService.pub(MQTT_TOPIC.USER_RECEIVING_RETURNED_SIGNAL, {
              type: MQTT_TOPIC.USER_JOIN,
              payload: {
                message: `Someone has jointed room.`,
                data
              }
            });
            break;
      }
    });
  }

}

export default Room;