import React, { FC } from 'react';

interface UomModalBtnProps {
    isItemPresent: boolean;
    quantity: number;
    maxQuantity: number;
    handleAddItem: (e: any) => void;
    handleIncrease: (e: any) => void;
    handleDecrease: (e: any) => void;
    handleRemove?: (e: any) => void;
}

const UomModalBtn: FC<UomModalBtnProps> = (props) => {
    const { isItemPresent, quantity, handleAddItem, handleIncrease, handleDecrease } = props;

    const onDecrease = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        handleDecrease(e);
    };

    const onIncrease = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        handleIncrease(e);
    };

    const onAdd = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        handleAddItem(e);
    };

    return (
        <div className="w-full">
            {isItemPresent ? (
                <div className="flex h-[2.5vw] mob:h-[8.5vw] items-center justify-center border-[2px] border-primary-200 rounded-full bg-white w-max p-[.3vw] mob:px-[.7vw]">
                    <button
                        className="h-[1.5vw] w-[1.5vw] mob:h-[6vw] mob:w-[6vw] mob:text-[5.1vw] text-[1.1vw] flex items-center justify-center bg-primary rounded-full border border-primary-200"
                        onClick={onDecrease}
                    >
                        <span className="mb-1">–</span>
                    </button>
                    <div className="w-[1.1vw] mx-[.5vw]  mob:mx-[3vw] flex items-center justify-center">
                        <p className="text-[1.1vw] mob:text-[4.1vw] font-semibold text-black">{quantity}</p>
                    </div>
                    <button
                        className="h-[1.5vw] w-[1.5vw] mob:h-[6vw] mob:w-[6vw] mob:text-[5.1vw] text-[1.1vw] flex items-center justify-center bg-primary rounded-full border border-primary-200"
                        onClick={onIncrease}
                    >
                        <span className="mb-0.5">+</span>
                    </button>
                </div>
            ) : (
                <button
                    className="flex items-center justify-center gap-1 px-3 py-1.5 bg-white border border-[#EDE6D4] rounded-full text-black font-extrabold text-xs font-[SofiaPro] shadow-sm hover:bg-gray-50 transition-colors"
                    onClick={onAdd}
                >
                    Add <span className="text-sm font-bold">+</span>
                </button>
            )}
        </div>
    );
};

export default UomModalBtn;
