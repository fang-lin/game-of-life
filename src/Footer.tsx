import React from 'react';
import {FooterWrapper, Anchor} from './Footer.styles';

function Footer() {
    return <FooterWrapper>
        <Anchor href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank">Game of Life wiki</Anchor> | <Anchor
            href="https://github.com/fang-lin/game-of-life" target="_blank">GitHub</Anchor> | <Anchor
            href="https://www.fanglin.me/" target="_blank">Lin Fang in {(new Date()).getFullYear()}</Anchor> | <Anchor
            href="https://plotter.fanglin.me/" target="_blank">Function Plotter</Anchor> | <Anchor
            href="https://algorythm.fanglin.me/" target="_blank">algoRYTHM</Anchor>
    </FooterWrapper>;
}

export default Footer;
