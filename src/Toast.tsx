import React, {FunctionComponent, useEffect, useState, PropsWithChildren} from 'react';
import {ToastBackground, ToastWrapper} from './Toast.styles';

interface ToastProps {
    showToast: boolean;
    toggleToast: (show: boolean) => void;
}

const Toast: FunctionComponent<PropsWithChildren<ToastProps>> = ({children, showToast, toggleToast}) => {

    const [hide, setHide] = useState<boolean>(false);

    useEffect(() => {
        if (showToast) {
            setHide(false);
            setTimeout(() => {
                setHide(true);
                setTimeout(() => {
                    toggleToast(false);
                }, 500);
            }, 2000);
        }
    }, [showToast, toggleToast]);

    return showToast ?
        <ToastBackground>
            <ToastWrapper hide={hide}>{children}</ToastWrapper>
        </ToastBackground> : null;
};

export default Toast;
