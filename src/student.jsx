import React, { useEffect, useState } from 'react'
import { supabase } from './supabase/supabase'
import { useNavigate } from "react-router-dom";

function Student() {

    const navegacion = useNavigate();

    const [listtask, setlisttask] = useState([]);
    const [useractive, setuseractive] = useState([]);

    useEffect(() => {

        const getsession = async () => {

            const { data, error } = await supabase.auth.getSession()
            if (data.session && data.session.user.email !== 'omarmendezt29@gmail.com') {
                navegacion('/student')
        
                setuseractive(data.session.user.email)
            } else if (!data.session) {
                console.log('no hay ni mielda')
                navegacion('/')
            }

        }
        getsession()
    }, [])

    const tasklist = async () => {
        const { data } = await supabase.from('task').select().order('id', { ascending: true });
        setlisttask(data)
        console.log(listtask)
    }

    const handleruploadfile = async (e) => {

        
        const avatarFile = e.target.files[0]
        const name = e.target.files[0].name
        const { data, error } = await supabase
            .storage
            .from('files')
            .upload('tareas/' + e.target.dataset.task + ' ' + useractive + ' ' + name, avatarFile, {
                cacheControl: '3600',
                upsert: false
            })
            console.log(error)
        // console.log(e.target.dataset.task)

    }

    function handleLogout(e) {
        e.preventDefault()
        supabase.auth.signOut()
            .then(() => {
                console.log("Logout exitoso");
                navegacion('/')
                // Aquí puedes redireccionar al usuario a la página de inicio de sesión
            })
            .catch((error) => {
                console.log("Error en el logout", error);
            });
    }

    return (
        <div className='w-full grid grid-cols-12 bg-slate-900'>
            <aside id="default-sidebar" className="col-span-2 h-screen" aria-label="Sidebar">

                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-900 dark:bg-gray-800">
                    <ul className=" font-medium">
                        <li onClick={e => archivoslist(e)} className='hover:animate-pulse hover:pl-3'>
                            <a className="flex items-center p-2 py-6 text-white hover:text-black rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:cursor-pointer transition-all ease-in-out ">
                                <svg aria-hidden="true" className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-black dark:group-hover:text-black" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                                <span className="ml-3  ">Inicio</span>
                            </a>
                        </li>
                        <li onClick={e => tasklist(e)} className='hover:animate-pulse hover:pl-3'>
                            <a className="flex items-center p-2  py-6 text-white hover:text-black rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:cursor-pointer transition-all ease-in-out ">
                                <svg className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path kelinecap="round" kelinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"></path>
                                    <path kelinecap="round" kelinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                <span className="flex-1 ml-3 whitespace-nowrap">Ver tareas</span>
                            </a>
                        </li>
                        <li className='hover:animate-pulse hover:pl-3'>
                            <a className="flex items-center p-2  py-6 text-white hover:text-black rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:cursor-pointer transition-all ease-in-out ">
                                <svg className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path kelinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"></path>
                                </svg>

                                <span className="flex-1 ml-3 whitespace-nowrap">Videoconferencia</span>
                            </a>
                        </li>

                        <li className='hover:animate-pulse hover:pl-3'>
                            <a onClick={e => handleLogout(e)} className="flex items-center p-2  py-6 text-white hover:text-black rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:cursor-pointer transition-all ease-in-out ">
                                <svg className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path kelinecap="round" kelinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"></path>
                                </svg>
                                <span className="flex-1 ml-3 whitespace-nowrap">Logout</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>

            <div className='col-span-4 bg-slate-600 p-16'>
                {listtask.map(task =>

                    <div key={task.id} className='flex rounded flex-col  px-6 bg-slate-500 my-5 py-5'>

                        <div className='flex items-center justify-between'>
                            <h2 className='font-semibold text-3xl'>{task.name}</h2>
                            <h2 className='text-xs bg-amber-600 font-bold p-2 rounded-md'>{task.fecha}</h2>
                        </div>
                        <p className='mt-3 font-semibold text-xl'>Descripcion:</p>
                        <textarea className='bg-slate-900 text-white p-0 my-3 h-48 ps-3 pt-3' value='' disabled>{task.description}</textarea>

                        <input onChange={e => handleruploadfile(e)} data-task={task.name}  type='file' id={task.id} className='bg-slate-400 py-0 mt-4'/>
                        <button className='bg-slate-400 py-2 mt-3 hover:bg-black hover:text-white transition-all ease-in'>Subir archivo</button>
                    </div>

                )}
            </div>

        </div>

    )
}

export default Student