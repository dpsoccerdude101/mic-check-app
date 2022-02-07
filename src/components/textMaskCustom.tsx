import { forwardRef, useCallback } from 'react';
import MaskedInput from 'react-text-mask';

const TextMaskCustom = forwardRef<HTMLElement>((props, ref) => {
    const setRef = useCallback(
        (maskedInputRef: { inputElement: HTMLElement } | null) => {
            const value = maskedInputRef ? maskedInputRef.inputElement : null;
            if (typeof ref === 'function') {
                ref(value);
            } else if (ref) {
                ref.current = value;
            }
        },
        [ref]
    );

    return (
        <MaskedInput
            {...props}
            ref={setRef}
            mask={[
                '(',
                /[1-9]/,
                /\d/,
                /\d/,
                ')',
                ' ',
                /\d/,
                /\d/,
                /\d/,
                '-',
                /\d/,
                /\d/,
                /\d/,
                /\d/,
            ]}
            placeholderChar={'\u2000'}
            showMask
        />
    );
});

export default TextMaskCustom;
