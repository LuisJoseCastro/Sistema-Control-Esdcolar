// src/components/ui/Portal.tsx
import React from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode, ReactElement } from 'react';

interface PortalProps {
    children: ReactNode;
    wrapperId?: string;
}

const Portal: React.FC<PortalProps> = ({ children, wrapperId = 'portal-root' }): ReactElement => {
    let element = document.getElementById(wrapperId);
    
    if (!element) {
        element = document.createElement('div');
        element.setAttribute('id', wrapperId);
        document.body.appendChild(element);
    }

    return createPortal(children, element);
};

export default Portal;