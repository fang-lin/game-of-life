import React, {FunctionComponent, useEffect, useState, PropsWithChildren} from 'react';
import {ToastBackground, ToastWrapper} from './Toast.styles';

interface ToastProps {
    showToast: boolean;
    toggleToast: (show: boolean) => void;
}

const Toast: FunctionComponent<PropsWithChildren<ToastProps>> = ({children, showToast, toggleToast}) => {

    const [hide, setHide] = useState<boolean>(false);

    useEffect(() => {
        if (!showToast) return;
        setHide(false);
        const hideTimer = setTimeout(() => {
            setHide(true);
        }, 2000);
        const dismissTimer = setTimeout(() => {
            toggleToast(false);
        }, 2500);
        return () => {
            clearTimeout(hideTimer);
            clearTimeout(dismissTimer);
        };
    }, [showToast, toggleToast]);

    return showToast ?
        <ToastBackground role="status" aria-live="polite">
            <ToastWrapper hide={hide}>{children}</ToastWrapper>
        </ToastBackground> : null;
};

export default Toast;
