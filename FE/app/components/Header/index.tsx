import * as React from 'react';
import NavBar from './NavBar';

interface HeaderProps {
  id: string
}

function Header(props: HeaderProps) {
  return (
    <div>
      <NavBar>
        {` ${props?.id ? `Hello ${props.id}, ` : ''}Welcome to Drawing Game`}
      </NavBar>
    </div>
  );
}

export default Header;
