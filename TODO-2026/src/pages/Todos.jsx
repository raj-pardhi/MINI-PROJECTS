import { useState } from "react";

const Todos = () => {

    const [todos, setTodos] = useState("");

    const [list, setList] = useState(JSON.parse(localStorage.getItem("todos")) || []);

    const [search, setSearch] = useState("");

    const handleClick = () => {
        if (!todos.trim()) return;


        let newList = [...list, todos];
        setList(newList);
        localStorage.setItem("todos", JSON.stringify(newList));
        setTodos("");

    }

    const handleDelete = (index) => {

        let newList = list.filter((_, i) => i !== index);
        setList(newList);
        localStorage.setItem("todos", JSON.stringify(newList));
    }

    const filteredList = list.filter(items =>
        items.toLowerCase().includes(search.toLowerCase())
    )
    return (
        <div>


            <div className="flex gap-2.5">

                <div className="w-full h-[5vh] bg-gray-600 rounded-md outline-none flex items-center justify-center">
                    <input value={todos} onChange={e => setTodos(e.target.value)} className="w-full pl-3 outline-none text-white" type="text" placeholder="write somthing.." />


                </div>
                <button onClick={handleClick} className="p-3 bg-gray-600 cursor-pointer text-white rounded-2xl">Add</button>
            </div>

            <div className="border-2 border-gray-500 mt-5">
                <div className="">
                    <input className="h-10 text-white pl-4 w-full outline-none" value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Searching...." />
                </div>

            </div>


            <div className="w-full h-auto mt-5 border-gray-500 border-2">
                <ul>
                    {
                        filteredList.map((items, index) => (
                            <div className="text-white p-3 flex cursor-pointer items-center justify-between" key={index}>

                                <li>
                                    {typeof items === "object" ? items.text : items}
                                </li>

                                <div onClick={() => handleDelete(index)} className="bg-red-400 rounded-[4px] hover:bg-red-500 cursor-pointer p-3">
                                    <button className="cursor-pointer text-white">Delete</button>
                                </div>
                            </div>

                        ))
                    }
                </ul>

            </div>

        </div>
    )
}

export default Todos