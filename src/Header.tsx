import React from 'react';
import {HeaderWrapper, Anchor, H1} from './Header.styles';
import pkg from '../package.json';

function Header() {
    return <HeaderWrapper>
        <Anchor href="./" target="_blank"><H1>Conway's Game of Life {pkg.version}</H1></Anchor>
    </HeaderWrapper>;
}

export default Header;
