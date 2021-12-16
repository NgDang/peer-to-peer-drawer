import React, {useState, useRef, useEffect} from 'react'
import { createSocketConnectionInstance} from '../../services/connection'
import { getObjectFromUrl} from '../../utils/common'
import { Wrapper, ButtonLeave, LeftPanel, RightPanel, MessageItem } from './styles'
import Canvas from '../../components/Canvas'
import Paper from "paper";

function RoomComponent(props : any) {
	const step = 10;
	let socketInstance = useRef(null);
	const [userDetails, setUserDetails] = useState(null);
	const [keydown, setKeydown] = useState('')
	const [messages, setMessages] = useState([]);


	useEffect(() => {
		const userName = prompt('Please Enter your Name')
		if (userName){
			setUserDetails(userName)
		};
		return () => {
			socketInstance.current?.destroyConnection();
			document.removeEventListener("keydown", handleKeyDown.bind(messages));
		}
	}, []);

	useEffect(() => {
		if (userDetails) {
			startConnection()
			document.addEventListener("keydown", handleKeyDown);
		};
	}, [userDetails]);

	useEffect(() => {
		if (userDetails && keydown) {
			if (userDetails) {
				const positionTwo = 
				messages?.[messages.length - 1]?.message?.positionTwo 
				|| messages?.[messages.length - 1]?.message?.positionOne 
				|| { x: 100, y: 100 }
				const newPoint: any = { ...positionTwo }
				if (keydown == 'a') {
					newPoint.x -= step;
				} else if (keydown == 'd') {
					newPoint.x += step;
				} else if (keydown == 'w') {
					newPoint.y -= step;
				} else if (keydown == 's') {
					newPoint.y += step;
				}
				console.log({ messages: messages, positionTwo, newPoint })
				const messageDetails = {
					message: {
						name: userDetails,
						message: keydown,
						timestamp: new Date(),
						positionOne: positionTwo,
						positionTwo: newPoint
					},
					userData: userDetails
				}
				socketInstance.current.broadcastMessage(messageDetails);
				setKeydown('')
			}
		};
	}, [keydown]);





	useEffect(() => {
		if (messages.length > 0) {
			const canvas: any = document.getElementById('canvas');
			const path: any = new Paper.Path();
			path.strokeColor = 'black';
			messages.forEach((item) => {
				const { positionOne, positionTwo } = item?.message
				const pointOne = new Paper.Point(positionOne.x, positionOne.y);
				path.add(pointOne);
				const pointTwo = new Paper.Point(positionTwo.x, positionTwo.y);
				path.add(pointTwo);
			})
			
			// const pointTwo = new Paper.Point(positionTwo.x, positionTwo.y);
			
			
			// path.moveTo(pointOne);
			// path.lineTo(pointOne.add(pointTwo));
			// path.closed = true;

			Paper.setup(canvas);
			(Paper as any).view.draw();
		}
	}, [messages.length])


	const startConnection = () => {
		let params = getObjectFromUrl();
		if (!params) params = { quality: 12 }
		socketInstance.current = createSocketConnectionInstance({
			updateInstance: (key: string, value: any) => {
				if (key === 'message') setMessages([...value]);
			},
			params,
			userDetails
		})
	}

	const handleDisconnect = () => {
		socketInstance.current?.destroyConnection();
		props.history.push('/')
	}

	const handleKeyDown = (event: any) => {
		setKeydown(event.key)

	}



	return (
		<Wrapper>
			<LeftPanel>
				<Canvas />
				{userDetails && (
					<div className='cam'>
						<div id="room-container"></div>
						<ButtonLeave type="button" onClick={handleDisconnect}>Leave</ButtonLeave>
					</div>
				)}
			</LeftPanel>
			
			
			<RightPanel>
				{messages.map((item, key) => (
					<MessageItem key={key} className={`${item.message.name === userDetails ? 'active' : ''}`}>
						<p>{item.message.name}:</p>
						<span>
							{item.message.message}
						</span>
					</MessageItem>
				))}
				
				
			</RightPanel>
		</Wrapper>
		
	)
}

export default RoomComponent
