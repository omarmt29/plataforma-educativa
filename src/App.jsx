import './App.css'
import { useState, useEffect } from 'react'
import { supabase } from './supabase/supabase'
import { useNavigate } from "react-router-dom";

function App() {

  const [user, setUser] = useState({ email: '', password: '' });
  const [Login, setLogin] = useState(true)
  // const [profile, setprofile] = useState({ id: '', email: '')
  const [admin, setadmin] = useState(false);
  const navegacion = useNavigate();

  const CreateUser = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password
    })
    console.log(error)
    console.log(data)
    console.log(data.user.email)
    if (data) {
      const { error } = await supabase
        .from('profile')
        .insert({ email: data.user.email })

        console.log('error : ' + error)
    }
    setadmin(data.user.email)
    setadmin(data.user.email)
  }

  const login = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: user.password,
    })
    window.location.reload(false);
    console.log(data)

  }

  function handleLogout(e) {
    e.preventDefault()
    supabase.auth.signOut()
      .then(() => {
        console.log("Logout exitoso");
        window.location.reload(false);

        // Aquí puedes redireccionar al usuario a la página de inicio de sesión
      })
      .catch((error) => {
        console.log("Error en el logout", error);
      });
  }

  function handlermateria(e) {
    e.preventDefault()
    navegacion('/admin')

  }

  useEffect(() => {

    const getsession = async () => {

      const { data, error } = await supabase.auth.getSession()
      // console.log(data.session.user.email)
      // data ?  setadmin(data.session.user.email) : null
      console.log(data.session)

      if (data.session && data.session.user.email == 'omarmendezt29@gmail.com' || data.session && data.session.user.email == 'juan.08migu@gmail.com') {
        setadmin(true)
        console.log('hay data y soy admin')
        console.log(data.session.user.email)
        setadmin(data.session.user.email)
      } else if (data.session && data.session.user.email !== 'omarmendezt29@gmail.com' || data.session && data.session.user.email !== 'juan.08migu@gmail.com') {
        console.log('hay data y soy estudiante')
        setadmin(data.session.user.email)
        navegacion('/student')
      } else if (!data.session) {
        console.log('no hay ni mielda')
      }

      // if(!data.session && !data.session.user.email == 'omarmendezt29@gmail.com'){
      //   console.log('soy estudiante')
      // }


    }
    getsession()
  }, [])




  // {admin == 'omarmendezt29@gmail.com' ? 'hola' : 'no hay na'}

  return (
    <div className='w-full h-screen flex-col flex justify-center items-center bg-slate-950'>




      {!admin

        ?
        <div className='flex flex-col w-80 gap-3'>
          <input onChange={e => setUser({ ...user, email: e.target.value })} placeholder='email' type="email" className='border-2 border-gray-500 p-2 rounded-md  focus:outline-orange-500 outline-none px-3 bg-slate-400 py-3 placeholder-black text-white' />
          <input onChange={e => setUser({ ...user, password: e.target.value })} type="password" placeholder='password' className='border-2 border-gray-500 p-2 rounded-md  focus:outline-orange-500 outline-none  px-3 bg-slate-400 py-3 text-white placeholder-black' />

          {Login ? <p onClick={e => setLogin(!Login)} className='text-gray-500 hover:cursor-pointer hover:text-gray-300'>If you dont have account register here</p> : <p onClick={e => setLogin(!Login)} className='text-gray-500 hover:cursor-pointer hover:text-gray-300'>I have account</p>}
          {Login ? <button onClick={e => login(e)} className='bg-orange-500 py-3 font-bold'>Login</button> : <button onClick={e => CreateUser(e)} className='bg-green-500 py-3 font-bold'>Register</button>}
        </div>

        :

        null
      }



      {admin && admin == 'omarmendezt29@gmail.com' || admin && admin == 'juan.08migu@gmail.com'
        ?
        <div>
          <h2 className='text-white text-center mb-7 text-4xl'>Selecciona la materia</h2>
          <div className='flex flex-wrap items-center justify-center'>

            <button onClick={e => handlermateria(e)} type="button" className="hover:animate-pulse transition-all ease-in duration-300 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Sociales</button>
            <button type="button" className="hover:animate-pulse  transition-all ease-in duration-300 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Lengua española</button>
            <button type="button" className="hover:animate-pulse transition-all ease-in duration-300 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Matematica</button>
            <button type="button" className="hover:animate-pulse transition-all ease-in duration-300 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Laboratorio</button>
            <button type="button" className="hover:animate-pulse transition-all ease-in duration-300 text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Naturales</button>
            <button type="button" className="hover:animate-pulse transition-all ease-in duration-300 text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Religion</button>
            <button type="button" className="hover:animate-pulse transition-all ease-in duration-300 text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Informatica</button>

          </div>
        </div>

        :
        null
      }


      {admin && admin !== 'omarmendezt29@gmail.com' || admin && admin !== 'juan.08migu@gmail.com' ?
        <div className='mt-4 flex flex-col justify-center'>
          <p className='text-white bg-green-700 p-6 mb-4'>Please check your email!! ✅</p>
          <button className='bg-red-700 text-white p-3' onClick={e => handleLogout(e)}>Volver</button>
        </div>
        : null}

    </div>
  )
}

export default App
