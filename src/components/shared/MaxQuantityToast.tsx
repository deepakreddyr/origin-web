import React, { FC, useEffect } from 'react';
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface MaxQuantityToastProps {
    maxQuantity: number | null;
    isVisible: boolean;
    onClose: () => void;
    itemName?: string;
    isInsideModal?: boolean;
    customMessage?: string;
}

const MaxQuantityToast: FC<MaxQuantityToastProps> = ({
    maxQuantity,
    isVisible,
    onClose,
    itemName = "this item",
    isInsideModal = false,
    customMessage
}) => {

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;
    if (maxQuantity === null && !customMessage) return null;

    const message = customMessage || `Maximum quantity of ${maxQuantity} reached for ${itemName}.`;

    if (isInsideModal) {
        return (
            <div
                className={`absolute left-1/2 top-4 transform -translate-x-1/2 w-[90%] transition-opacity duration-300 ease-in-out z-[99999] ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            >
                <div className="flex items-center bg-black rounded-full shadow-xl h-10 px-4 w-full relative">
                    <div className="flex items-center justify-center w-full gap-2">
                        <InfoOutlinedIcon sx={{ color: 'yellow', fontSize: '1.2rem', flexShrink: 0 }} />
                        <p className="text-[0.70rem] font-semibold text-white text-center leading-tight truncate">
                            {message}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`fixed z-[60] left-1/2 top-14 transform -translate-x-1/2 w-[90%] max-w-sm transition-opacity duration-300 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
        >
            <div className="flex items-center bg-black rounded-full shadow-xl h-10 px-4 w-full relative">
                <div className="flex items-center justify-center w-full gap-2">
                    <InfoOutlinedIcon sx={{ color: 'yellow', fontSize: '1.2rem', flexShrink: 0 }} />
                    <p className="text-[0.70rem] font-semibold text-white text-center leading-tight truncate">
                        {message}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MaxQuantityToast;
