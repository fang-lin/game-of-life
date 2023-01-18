import React, {FunctionComponent} from 'react';
import {HeaderWrapper, Anchor, H1} from './Header.styles';
import pkg from '../package.json';

const Header: FunctionComponent = () => {
    return <HeaderWrapper>
        <Anchor href="./" target="_blank">
            <H1>
                <span>Conway's</span><br/>
                <span>Game of Life</span><br/>
                <span>{pkg.version}</span>
            </H1>
        </Anchor>
    </HeaderWrapper>;
};

export default Header;
