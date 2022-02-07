import React from 'react';
import './modal.css';
import { motion } from "framer-motion";

function Modal({ children }) {
    return (
        <motion.section 
            className='modal'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="modal__content">
                {children}
            </div>
        </motion.section>
    );
}

export default Modal;