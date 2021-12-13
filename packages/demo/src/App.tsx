import React, { FC } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import { GlobalStyle } from './styles';
import HomePage from './pages/Home'
import RoomList from './pages/Room'

const App: FC = () => {
	return (
		<>
			<GlobalStyle />
			<div className="App">
				<Router>
					<Switch>
						<Route exact path="/" component={HomePage} />
						<Route exact path="/room" component={RoomList} />
					</Switch>
				</Router>
			</div>
		</>
	);
}

export default App;
