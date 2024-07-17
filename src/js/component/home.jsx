import React, { useRef, useState, useEffect } from "react";
import Task from "./Task"

const Home = () => {
    const tasksRef = useRef([]);
    const inputRef = useRef(null);
    const [rerenderFlag, setRerenderFlag] = useState(false);
    const API_URL = "https://playground.4geeks.com/todo/users/jc44";

    useEffect(() => {
        fetchTasks();
    }, []);
    // creates user if user not created it will create the user
    const fetchTasks = () => {
        fetch(API_URL)
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.detail == "User jc44 doesn't exist.") {
                    fetch("https://playground.4geeks.com/todo/users/jc44", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'accept': 'application/json' 
                        }
                    })
                    .then(() => {
                       tasksRef.current = [];
                    })
                } else {
                    tasksRef.current = data.todos; 
                    setRerenderFlag(!rerenderFlag);
                }
            })
    };   
    // adds items to api
    const handleAddTask = (e) => {
        e.preventDefault();
        const newTaskLabel = inputRef.current.value.trim();
        if (newTaskLabel === '') return;
    
        const newTask = {
            label: newTaskLabel,
            is_done: false
        };
    
        fetch("https://playground.4geeks.com/todo/todos/jc44", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify(newTask),
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            tasksRef.current.push(data); 
            setRerenderFlag(!rerenderFlag); 
            inputRef.current.value = '';
            inputRef.current.focus(); 
        })
    };
    

    const handleDeleteTask = (taskId) => {
        fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
            method: 'DELETE',
            headers: {
                'accept': 'application/json'
            },
        })
        .then(() => {
            tasksRef.current = tasksRef.current.filter(task => task.id !== taskId);
            setRerenderFlag(!rerenderFlag);
        })
    };
    // Erases everything and creates a new user
    const handleDeleteAllTasks = () => {
        fetch(API_URL, {
            method: 'DELETE',
            headers: {
                'accept': 'application/json'
            },
        })
        .then(() => {
            return fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json' 
                },
                body: JSON.stringify({
                    name: 'jc44',
                    todos: []
                }),
            });
        })
        .then(() => {
            return fetchTasks();
        })
    };
    

    return (
        <div className="container text-center listBox">
            <h1 style={{ color: "red" }}>Todo List</h1>
            <form onSubmit={handleAddTask}>
                <input
                    type="text"
                    ref={inputRef}
                    placeholder="What needs to be done?"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleAddTask(e);
                        }
                    }}
                />
            </form>
            {tasksRef.current.length === 0 ? (
                <h1>No tasks, add a task</h1>
            ) : (
                <div>
                    {tasksRef.current.map(task => (
                        <div className="taskList">
                            <Task key={task.id} task={task} onDelete={handleDeleteTask} />
                        </div>
                    ))}
                </div>
            )}
            <div className="fixed-bottom itemCount">
                {tasksRef.current.length} items left
            </div>
            <button onClick={handleDeleteAllTasks} style={{ backgroundColor: "red", border: "1px solid", borderRadius: "5px solid" }} className="btn">Delete All</button>
        </div>
    );
};

export default Home;
