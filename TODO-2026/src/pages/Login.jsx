
const Login = () => {
    return (
        <div className="w-full flex flex-col items-center gap-10">
            <h1 className="w-full text-6xl text-center text-white font-bold">Login page</h1>

            <div className="flex flex-col justify-center gap-4 border-gray-300 border-2 p-5 w-[25vw] h-[25vw]">
                <div className="border-2 py-2 border-white">
                    <input className="text-white pl-3 w-full py-2 outline-none" type="text" placeholder="Username" />

                </div>
                <div className="border-2 py-2 border-white">
                    <input className="text-white pl-3 w-full py-2 outline-none" type="password" placeholder="Password" />
                </div>
                <button className="bg-blue-500 text-white py-2 px-4 rounded-md">Login</button>
            </div>



        </div>
    )
}

export default Login