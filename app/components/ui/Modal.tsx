// components/Modal.tsx
import { X } from "lucide-react";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, closeModal, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-1/3 relative">
        <button
          className="absolute top-4 right-4 text-gray-500"
          onClick={closeModal}
        >
          <X size={24}/>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
