import * as React from 'react';
import NavBar from './NavBar';

interface HeaderProps {
  username: string
}

function Header(props: HeaderProps) {
  return (
    <div>
      <NavBar>
        {` ${props?.username ? `Hello ${props.username}, ` : ''}Welcome to Drawing Game`}
      </NavBar>
    </div>
  );
}

export default Header;
