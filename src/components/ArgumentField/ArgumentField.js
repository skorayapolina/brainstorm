import { useCallback } from 'react';
import { ReactComponent as SendIcon } from '../../icons/send.svg';
import './ArgumentField.css';

export const ArgumentField = ({
    onFocus,
    onBlur,
    onChange,
    onClick,
    value,
    isSendShown,
    placeholder,
}) => {
    const onKeyDown = useCallback((event) => {
        if (event.which === 13 && !event.shiftKey) {
            if (!event.repeat) {
                onClick();
                event.preventDefault();
            }
        }
    }, [onClick]);

    return (
        <form className="field-form">
            <textarea
                onKeyDown={onKeyDown}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={onChange}
                value={value}
                className="field-textarea"
                placeholder={placeholder}
            />
            {isSendShown && (
                <button
                    className="button button-send-argument"
                    onClick={onClick}
                >
                    <SendIcon />
                </button>
            )}
        </form>
    );
}
