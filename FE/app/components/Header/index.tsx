import * as React from 'react';
import NavBar from './NavBar';

interface HeaderProps {
  name: string
}

function Header(props: HeaderProps) {
  return (
    <div>
      <NavBar>
        {` ${props?.name ? `Hello ${props.name}, ` : ''}Welcome to Drawing Game`}
      </NavBar>
    </div>
  );
}

export default Header;
