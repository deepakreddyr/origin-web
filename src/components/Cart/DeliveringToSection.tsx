import React, { FC } from 'react';
import Image from 'next/image';
import { ADDRESS_ICON_MAP } from '@/utilities/maps';

interface DeliveringToSectionProps {
    address: any;
    onChangeClick: () => void;
    receiverDetails: {
        receiver_name: string;
        receiver_phone: string;
    };
    setReceiverDetails: (details: any) => void;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

const DeliveringToSection: FC<DeliveringToSectionProps> = ({
    address,
    onChangeClick,
    receiverDetails,
    setReceiverDetails,
    isOpen,
    onClose,
    onSave,
}) => {
    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // For phone number, only allow digits and max 10 chars
        if (name === 'receiver_phone') {
            const numericValue = value.replace(/\D/g, '').slice(0, 10);
            setReceiverDetails((prev: any) => ({
                ...prev,
                [name]: numericValue,
            }));
        } else {
            setReceiverDetails((prev: any) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-[2000]"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[2001] flex items-end justify-end pointer-events-none">
                <div className="w-[30vw] mob:w-full bg-white rounded-t-[24px] shadow-lg pointer-events-auto animate-slide-up">
                    {/* Modal Header */}
                    <div className="flex justify-between items-center p-6 pb-4 border-b border-[#F2EEE4]">
                        <h2 className="font-[SofiaPro] font-bold text-lg text-[#231F20]">
                            Send it as a gift
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-[#231F20] text-2xl leading-none"
                        >
                            ×
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                        <p className="font-[SofiaPro] text-sm text-[#231F20CC] mb-6">
                            The contact details provided will be used for delivery coordination.
                        </p>

                        {/* Current Address Card */}
                        {address ? (
                            <div className="bg-[#F9F5EA] rounded-[16px] p-4 flex items-start gap-3 relative mb-6">
                                <div className="flex-shrink-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1.5">
                                    {ADDRESS_ICON_MAP[address.address_name] && (
                                        <Image
                                            src={ADDRESS_ICON_MAP[address.address_name]}
                                            alt={address.address_name}
                                            width={20}
                                            height={20}
                                        />
                                    )}
                                </div>
                                <div className="flex-grow pr-12">
                                    <h4 className="font-[SofiaPro] font-bold text-sm text-[#231F20] mb-0.5">
                                        {address.address_name}
                                    </h4>
                                    <p className="font-[SofiaPro] text-xs text-[#231F20CC] leading-relaxed line-clamp-2">
                                        {address.address}, {address.city}, {address.state} - {address.pincode}
                                    </p>
                                </div>
                                <button
                                    onClick={onChangeClick}
                                    className="absolute top-4 right-4 font-[SofiaPro] font-semibold text-xs text-[#231F20] underline"
                                >
                                    Change
                                </button>
                            </div>
                        ) : (
                            <div className="bg-[#F9F5EA] rounded-[16px] p-4 flex justify-between items-center mb-6">
                                <p className="font-[SofiaPro] text-sm text-[#231F20CC]">
                                    No address selected
                                </p>
                                <button
                                    onClick={onChangeClick}
                                    className="font-[SofiaPro] font-bold text-sm text-[#231F20] bg-primary px-4 py-2 rounded-full"
                                >
                                    Select Address
                                </button>
                            </div>
                        )}

                        {/* Receiver's Information Section */}
                        <div>
                            <div className="flex flex-col gap-4">
                                {/* Receiver's Name */}
                                <div className="flex flex-col gap-2">
                                    <label className="font-[SofiaPro] font-semibold text-sm text-[#231F20]">
                                        Receiver's Name
                                    </label>
                                    <input
                                        type="text"
                                        name="receiver_name"
                                        placeholder="Enter Receiver Name"
                                        value={receiverDetails.receiver_name}
                                        onChange={handleChange}
                                        className="w-full bg-[#FAF9F6] border border-[#F2EEE4] rounded-[12px] px-4 py-3 font-[SofiaPro] text-sm focus:outline-none focus:border-primary placeholder:text-[#231F204D]"
                                    />
                                </div>

                                {/* Receiver's Contact Number */}
                                <div className="flex flex-col gap-2">
                                    <label className="font-[SofiaPro] font-semibold text-sm text-[#231F20]">
                                        Receiver's Contact Number
                                    </label>
                                    <div className="flex items-center gap-2 bg-[#FAF9F6] border border-[#F2EEE4] rounded-[12px] px-4 py-3">
                                        <span className="font-[SofiaPro] font-semibold text-sm text-[#231F20]">
                                            +91
                                        </span>
                                        <div className="w-[1px] h-4 bg-[#F2EEE4]"></div>
                                        <input
                                            type="tel"
                                            name="receiver_phone"
                                            placeholder="Enter Receiver Mobile Number"
                                            value={receiverDetails.receiver_phone}
                                            onChange={handleChange}
                                            className="w-full bg-transparent border-none p-0 font-[SofiaPro] text-sm focus:ring-0 focus:outline-none placeholder:text-[#231F204D]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="p-6 pt-4">
                        <button
                            onClick={onSave}
                            className="w-full bg-[#FFD700] hover:bg-[#FFC700] font-[SofiaPro] font-bold text-base text-[#231F20] py-4 rounded-full transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes slide-up {
                    from {
                        transform: translateY(100%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out;
                }
            `}</style>
        </>
    );
};

export default DeliveringToSection;