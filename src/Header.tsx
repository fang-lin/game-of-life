import React from 'react';
import {HeaderWrapper, Anchor} from './Header.styles';
import {version} from '../package.json';

function Header() {
    return <HeaderWrapper>
        <Anchor href="./">Conway's Game of Life {version}</Anchor>
    </HeaderWrapper>;
}

export default Header;
