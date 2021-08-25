import React, { useState } from 'react';
import Modal from './Modal';

const DeleteButton = ({ onSubmit, displayName }) => {

    const [visible, setVisible] = useState(false);

    const renderContent = () => {
        return `Seriously delete ${displayName}?`;
    };

    const renderActions = () => {
        return (
            <>
                <button
                    className="submit-button"
                    onClick={() => {
                        onSubmit();
                        setVisible(false);
                    }}
                >
                    Delete
                </button>
                <button
                    className="submit-button"
                    onClick={() => setVisible(false)}
                >
                    No Wait
                </button>
            </>
        );
    };

    const showModal = () => {

        return (
            <Modal 
                content={renderContent()}
                actions={renderActions()}
                onDismiss={() => setVisible(false)}
            />
        );
    };



    const onClick = (e) => {
        e.stopPropagation();
        setVisible(true);
    };


    return (
        <div>
            <img src="/images/delete.png" className="delete" onClick={onClick} />
            {visible && showModal()}
        </div>
    );

};

export default DeleteButton;