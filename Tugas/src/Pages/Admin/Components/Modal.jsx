import React from "react";
import Card from "./Card"; // Kita re-use Card untuk body modal
import Heading from "./Heading";
import Button from "./Button";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* Wrapper Card dengan ukuran maksimal */}
      <div className="w-full max-w-lg relative">
        <Card className="relative">
          {/* Tombol Close (X) di pojok kanan atas */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl"
          >
            &times;
          </button>

          {/* Judul Modal */}
          {title && (
            <Heading as="h3" align="left" spacing="mb-4">
              {title}
            </Heading>
          )}

          {/* Isi Modal */}
          <div className="mt-2">{children}</div>

          {/* Footer Modal (Opsional, contoh tombol tutup default) */}
          <div className="mt-6 flex justify-end">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Tutup
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Modal;
