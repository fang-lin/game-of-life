import React from 'react';
import {HeaderWrapper, Anchor} from './Header.styles';
import pkg from '../package.json';

function Header() {
    return <HeaderWrapper>
        <Anchor href="./">Conway's Game of Life {pkg.version}</Anchor>
    </HeaderWrapper>;
}

export default Header;
