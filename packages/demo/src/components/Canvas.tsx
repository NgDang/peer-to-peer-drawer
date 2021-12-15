import { useRef, useState, useEffect } from "react";
import Paper from "paper";

const Canvas = (props: any) => {
	const canvasRef = useRef(null);
	// const [radom, setRandom] = useState(Math.random());
	useEffect(() => {
		const canvas: any = canvasRef.current;
		Paper.setup(canvas);
		// Drawer();
	}, []);

	// const handleClear = () => {
	// 	Paper.project.activeLayer.removeChildren();
	// 	(Paper as any).view.draw();
	// 	setRandom(Math.random())
	// }

	return (
		<div>
			<canvas ref={canvasRef} {...props} id="canvas" resize={true} />
			{/* <button type="button" onClick={handleClear}>Clear</button> */}
		</div>
	);
};

export default Canvas;
