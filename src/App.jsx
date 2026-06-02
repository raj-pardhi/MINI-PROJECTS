import './App.css'
import { Canvas } from '@react-three/fiber'
import Model from './components/Model'
import { IoIosArrowForward } from "react-icons/io";
import { CgMenuRightAlt } from "react-icons/cg";
import { useEffect, useState } from 'react';
import DogImagePreloader from './components/Preloader/Preloader';
import Mainelement from './components/Mainelement';


function App() {


  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, []);

  return (
   <>
   <Mainelement/>
   </>
  )
}

export default App
