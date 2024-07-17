import React, {useState} from "react";

const Task = ({ task, onDelete }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleDelete = () => {
        onDelete(task.id);
    };

    return (
        <div
            className="task-item container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <span style={{fontSize:"40px"}}>• {task.label}</span>
            {isHovered && (
                <button className="delete-btn ms-5" onClick={handleDelete}>
                    <span role="img" aria-label="delete" className="delete-icon">❌</span>
                </button>
            )}
        </div>
    );
};

export default Task;