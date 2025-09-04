import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
    // Effect to handle the 'Escape' key to close the modal
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    // If the modal is not open, render nothing
    if (!isOpen) {
        return null;
    }

    return (
        // Main modal container with a semi-transparent background
        <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full overflow-hidden bg-black/40 backdrop-blur-sm">
            {/* Modal content card */}
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md m-4">
                {/* Modal Header with Title and Close Button */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* ✅ THIS IS THE FIX: Render the content passed to the modal */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
