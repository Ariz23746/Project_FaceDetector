import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
import brain from './brain.png';

const Logo = () => {
	return (
		<div className='ma4 mt0'>
			<Tilt className="Tilt br2 shadow-2" options={{ max : 25 }} style={{ height: 150, width: 150 }} >
			 	<div className="pa3 Tilt-inner">
			 		<img style={{ width: 100, height: 100, paddingTop: '5px'}} alt='logo' src={brain}/>
			 	</div>
			</Tilt>
		</div>
	);

}
export default Logo;