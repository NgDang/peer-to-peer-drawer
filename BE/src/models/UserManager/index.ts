import { v4 as uuid } from "uuid";
import User from './User';
import { User as UserType } from '../../types/user'




class UserManager {
	private userList:  Array<User>
	constructor() {
		this.userList = [];
	}

	getUserList(): UserType[] {
		const data: UserType[] = [];
		this.userList.forEach((user : User) => {
			data.push(user.info)
		})
		return data
	}

	getById(id: string): User | undefined {
		return this.userList.find(user => user.id === id);
  }

	checkUserExist(name: string): boolean {
		return this.userList.some(user => user.name === name)
	}

	addUser(name: string): User | undefined {
		if (this.checkUserExist(name)) {
			return undefined
		}
		const id = uuid();
		const user = new User({id, name} as UserType)
		this.userList.push(user)
		return this.getById(id);
	}
}

export default new UserManager()