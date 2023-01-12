import React, {FunctionComponent} from 'react';
import {FooterWrapper, Anchor} from './Footer.styles';

const Footer: FunctionComponent = () => {
    return <FooterWrapper>
        <Anchor href="https://conwaylife.com/wiki/" target="_blank">LifeWiki</Anchor> | <Anchor
            href="https://github.com/fang-lin/game-of-life" target="_blank">GitHub</Anchor> | <Anchor
            href="https://www.fanglin.me/" target="_blank">Lin Fang in {(new Date()).getFullYear()}</Anchor> | <Anchor
            href="https://plotter.fanglin.me/" target="_blank">Function Plotter</Anchor> | <Anchor
            href="https://algorythm.fanglin.me/" target="_blank">algoRYTHM</Anchor>
    </FooterWrapper>;
};

export default Footer;
