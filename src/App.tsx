import React, {Component, RefObject} from "react";
import {AppWrapper} from "./App.styles";
import debounce from 'lodash/debounce';
import Canvas from "./Canvas";
import {RouteComponentProps} from 'react-router-dom';

interface AppProps {

}

interface AppState {
    size: [number, number];
}

export class App extends Component<RouteComponentProps<AppProps>, AppState> {

    private readonly appRef: RefObject<HTMLDivElement>;

    constructor(props: RouteComponentProps<AppProps>) {
        super(props);
        this.appRef = React.createRef();
        this.state = {
            // dragState: DragState.end,
            size: [0, 0],
            // redrawing: false,
            // transform: [0, 0],
            // cursor: [0, 0],
            // trackPoint: [0, 0],
            // client: [0, 0]
        };
    }

    onResize = () => requestAnimationFrame(() => {
        const {width = 0, height = 0} = this.appRef.current?.getBoundingClientRect() || {};
        this.setState({size: [width, height]});
    });

    onResizing = debounce(this.onResize, 200);

    componentDidMount(): void {
        this.onResize();
        window.addEventListener('resize', this.onResize);
        // window.addEventListener(DragEvents[DragState.moving], this.onMoving);
        // window.addEventListener(DragEvents[DragState.start], this.onDragStart);
    }

    componentWillUnmount(): void {
        window.removeEventListener('resize', this.onResize);
        // window.removeEventListener(DragEvents[DragState.moving], this.onMoving);
        // window.removeEventListener(DragEvents[DragState.start], this.onDragStart);
    }

    render() {
        const size = this.state.size;
        console.log('render', size);
        return (
            <AppWrapper ref={this.appRef}>
                <Canvas {...{size}}/>
            </AppWrapper>
        );
    }
}

export default App;
