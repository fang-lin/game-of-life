import React from 'react';
import {FooterWrapper, Anchor} from './Footer.styles';
import {version} from '../package.json';

function Footer() {
    return <FooterWrapper>
        <Anchor href="./">Conway's Game of Life {version}</Anchor> | <Anchor
            href="https://github.com/fang-lin/game-of-life" target="_blank">GitHub</Anchor> | <Anchor
            href="https://www.fanglin.me/" target="_blank">Lin Fang in {(new Date()).getFullYear()}</Anchor> | <Anchor
            href="https://plotter.fanglin.me/" target="_blank">Function Plotter</Anchor> | <Anchor
            href="https://algorythm.fanglin.me/" target="_blank">algoRYTHM</Anchor>
    </FooterWrapper>;
}

export default Footer;
