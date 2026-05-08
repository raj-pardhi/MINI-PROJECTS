import { IoPersonCircleOutline } from 'react-icons/io5'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <div>
            <div className="w-full h-14 mb-4 flex items-center justify-between text-white bg-gray-600">

                <Link to="/">
                    <img className="h-[62px]" src="https://logowik.com/content/uploads/images/todo-group3144.logowik.com.webp" alt="" />

                </Link>



                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
                <IoPersonCircleOutline className="text-6xl cursor-pointer" />



            </div>
        </div>
    )
}

export default Navbar