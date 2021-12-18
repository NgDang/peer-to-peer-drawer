import { User as UserType } from '../../types/user'

class User {
	private _id: string;	
	private _name: string;
	private _room: string | undefined;

	constructor(data : UserType) {
		this._id = data?.id;
		this._name = data?.name;
		this._room = data?.room;
	}

	get id() {
		return this._id;
	}

	get name() {
		return this._name;
	}

	get room() {
		return this._room;
	}

	get info() {
		return {
			id: this.id,
			name: this.name,
			room: this.room
		}
	}

	joinRoom(idRoom: string) {
		this._room = idRoom;
	}

	leaveRoom() {
		this._room = ''
	}

}

export default User;