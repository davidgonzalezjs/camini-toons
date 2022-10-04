import {useState} from 'react';

export function useModalState() {
    const [show, setShow] = useState(false);

    return [show, () => setShow(true), () => setShow(false)];
}