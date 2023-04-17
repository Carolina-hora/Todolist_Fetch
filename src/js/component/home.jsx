import React, { useState, useEffect} from "react";



//create your first component
const Home = () => {
	const [newTask, setNewTask] = useState("");
	const [taskList, setTaskList] = useState([]);

	useEffect (() => {
		getList();
	}, []) //with the empty array(== no dependencies), the useEffect runs onload (runs just when you refresh the page)


	const getList = async () => {
		const response = await fetch("https://assets.breatheco.de/apis/fake/todos/user/carolina22")
		const data = await response.json()
		console.log(data)

		setTaskList(data)
	}

	const updateList = async (updatedTaskList) => {
		
		try {
			const response = await fetch("https://assets.breatheco.de/apis/fake/todos/user/carolina22", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				}, 
				body: JSON.stringify(updatedTaskList)
				
			});
			
			const data = await response.json()
			console.log(data)
			if (response.ok) {
				console.log("Task added!")
			}
		} catch (error) {
			console.log(error)
		}
		
	}


	const handleSubmit = async (event) => {
		if (newTask.trim() === "") return; // prevents a new task from being created if the task's name consists only of whitespace or is an empty string.
		const formattedTask = (newTask.charAt(0).toUpperCase()) + (newTask.toLowerCase().slice(1)) 
		const auxTaskList = [...taskList, {label: formattedTask.trim(), done: false}]
		setTaskList(auxTaskList)
		//console.log(taskList)
		setNewTask("")
		await updateList(auxTaskList)
		
	}

	const handleDelete = async (labelToDelete) => {
		
		const filteredTasks = taskList.filter((t) => t.label.toLowerCase() !== labelToDelete.toLowerCase())
		setTaskList (filteredTasks)
		if (filteredTasks.length === 0) {
			await updateList([{label: "Default Task", done: false, hidden: true}])
		} else {
			await updateList(filteredTasks)}
	}

	const cleanAllTasks = async () => {
		const defaultTask = { label: "Default Task", done: false, hidden: true };
		const updatedTaskList = [defaultTask];
		setTaskList(updatedTaskList);
		await updateList(updatedTaskList);
	}

	return (
		<div className="container">
			<h1 className="text-center display-1 text-red">todos</h1>
			<div className="mx-auto row bg-light">
				<input className="border border-rounded border-secondary-subtle pt-2 pb-2 input-css" type ="text" 
				onChange={e => setNewTask(e.target.value)} placeholder="Insert your next task" value={newTask}
				onKeyUp={e => e.key === "Enter" && handleSubmit(e)} />
				<div className="col-sm-12 col-md-12 col-lg-12 fs-4 ps-4 border border-secondary-subtle">
					{
						taskList.map((formattedTask, index) => (
							formattedTask.hidden ? null : (
							<div key={index} className="task-item text-break pt-2 pb-2">{index}. {formattedTask.label} <i className="fas fa-trash-alt ms-auto text-red" onClick={(e) => handleDelete(formattedTask.label)}></i></div>)
						))}
				</div>
				<div className="col-sm-12 col-md-12 col-lg-12 fs-5 ps-4 pt-2 pb-2 text-red border border-secondary-subtle">
					{taskList.filter(task => !task.hidden).length === 0 ? "No tasks, please add a new task!" : taskList.filter(task => !task.hidden).length === 1 ? "1 item left" : `${taskList.filter(task => !task.hidden).length} items left`
					}
					</div>
			</div>
			<div><button className="button-tasks text-white mt-4" onClick={()=> cleanAllTasks()}>Clean all tasks!</button></div>
			
		</div>
	);
};

export default Home;
