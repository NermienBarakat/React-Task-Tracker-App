import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';

// Routes
import About from './components/About';

const App = () => {
	const [tasks, setTasks] = useState('');
	const [showAddTask, setShowAddTask] = useState(false);

	useEffect(() => {
		const GetTasks = async () => {
			const tasksFromServer = await fetchTasks();
			setTasks(tasksFromServer);
		};
		GetTasks();
	}, []);
	// Fetch Tasks
	const fetchTasks = async () => {
		const res = await fetch('http://localhost:5000/tasks');
		const data = await res.json();
		return data;
	};

	// Fetch Task
	const fetchTask = async (id) => {
		const res = await fetch(`http://localhost:5000/tasks/${id}`);
		const data = await res.json();
		return data;
	};

	// Add task
	const addTask = async (task) => {
		const res = await fetch(`http://localhost:5000/tasks`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify(task),
		});
		const data = await res.json();
		setTasks((tasks) => [...tasks, data]);
		// const id = Math.floor(Math.random() * 10000 + 1);
		// const newTask = { id, ...task };
		// setTasks((tasks) => [...tasks, newTask]);
	};

	// Delete task
	const deleteTaskHandler = async (id) => {
		await fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' });
		const filter = tasks.filter((task) => task.id !== id);
		setTasks(filter);
	};

	// toggle Reminder
	const toggleReminderHandler = async (id) => {
		const taskToToggle = await fetchTask(id);
		const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder };
		const res = await fetch(`http://localhost:5000/tasks/${id}`, {
			method: 'PUT',
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify(updTask),
		});
		const data = await res.json();
		const reminder = tasks.map((task) =>
			task.id === id ? { ...task, reminder: data.reminder } : task
		);
		setTasks(reminder);
	};
	// Toggle btn
	const onAddHandler = () => {
		setShowAddTask(!showAddTask);
	};

	return (
		<Router>
			<div className="container">
				<Header
					title={'Task Tracker'}
					onAdd={onAddHandler}
					showAddTask={showAddTask}
				/>
				<Route
					path="/"
					exact
					render={(props) => {
						return (
							<>
								{showAddTask && <AddTask onAdd={addTask} />}
								{tasks.length > 0 ? (
									<Tasks
										tasks={tasks}
										onDelete={deleteTaskHandler}
										onToggle={toggleReminderHandler}
									/>
								) : (
									'No tasks to show'
								)}
							</>
						);
					}}
				/>

				<Route path="/about" component={About} />
				<Footer />
			</div>
		</Router>
	);
};

export default App;
