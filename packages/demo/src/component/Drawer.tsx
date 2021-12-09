import Paper from "paper";

const Drawer = () => {
  let myPath = new Paper.Path();

	const position = new Paper.Point(100, 100);

	const step = 10;

	myPath.strokeColor = new Paper.Color('black');
	myPath.strokeWidth = 3;
	myPath.add(position);
	
	function onKeyDown(event) {
		if(event.key == 'a') {
			position.x -= step;
		}
	
		if(event.key == 'd') {
			position.x += step;
		}
	
		if(event.key == 'w') {
			position.y -= step;
		}
	
		if(event.key == 's') {
			position.y += step;
		}
		myPath.add(position);
	}

	Paper.view.on('keydown', onKeyDown);

  (Paper as any).view.draw();
};

export default Drawer;
