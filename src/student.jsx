import React, { useEffect, useState } from 'react'
import { supabase } from './supabase/supabase'
import { useNavigate } from "react-router-dom";
import { FaBars } from 'react-icons/fa';

function Student() {

    const navegacion = useNavigate();

    const [menu, setmenu] = useState('');
    const [userid, setuserid] = useState('');
    const [nota, setnota] = useState([]);
    const [listtask, setlisttask] = useState([]);
    const [useractive, setuseractive] = useState([]);
    const [conferencelist, setconferencelist] = useState([]);

    const [listdiv, setlistdiv] = useState(false);
    const [notasdiv, setnotasdiv] = useState(false);
    const [conferencediv, setconferencediv] = useState(false);
    const [logindiv, setlogindiv] = useState(true);


 
    const tasklist = async () => {
        const { data } = await supabase.from('task').select().order('id', { ascending: true });
        setlisttask(data)
        setlistdiv(true)
        setnotasdiv(false)
        setlogindiv(false)
        setconferencediv(false)


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

    function handlermenu(e) {
        e.preventDefault()
        menu == ' -left-full' ? setmenu('') : setmenu(' -left-full')

    }


    const getnotademi = async (e) => {

        const { data, error } = await supabase.auth.getSession()

        setuserid(data.session.user.email)

        const getnota = async () => {
            const { data, error } = await supabase
                .from('profile')
                .select('*')
                .eq('email', userid)

            setnota(data)


        }
        getnota();

        setnotasdiv(true)
        setlistdiv(false)
        setlogindiv(false)
        setconferencediv(false)

    }

    const handlerlogindiv = async (e) => {
        setlogindiv(true)
        setnotasdiv(false)
        setlistdiv(false)
        setconferencediv(false)

    }

    const handlerconference = async (e) => {
        setconferencediv(true)
        setlogindiv(false)
        setnotasdiv(false)
        setlistdiv(false)

        const { data, error } = await supabase
            .from('conference')
            .select()
        // console.log(data)
        setconferencelist(data)
    }

    useEffect(() => {

        const getsession = async () => {

            const { data, error } = await supabase.auth.getSession()
            if (data.session && data.session.user.email !== 'omarmendezt29@gmail.com' || data.session && data.session.user.email !== 'juan.08migu@gmail.com') {
                navegacion('/student')

                setuseractive(data.session.user.email)
            } else if (!data.session) {
                console.log('no hay ni mielda')
                navegacion('/')
            }

        }
        getsession()
        getnotademi()
    }, [])



    return (
        <div className='w-full grid grid-cols-12 bg-slate-900'>
            <button className='absolute top-0 right-0 p-3  m-4 z-10  ' onClick={e => handlermenu(e)}><FaBars className='text-white text-2xl' /></button>
            <aside id="default-sidebar" className={"absolute col-span-2 h-screen z-20" + menu} aria-label="Sidebar">

                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-900 dark:bg-gray-800">
                    <ul className=" font-medium">

                        <li onClick={e => handlerlogindiv(e)} className='hover:animate-pulse hover:pl-3'>
                            <a className="flex items-center p-2 py-6 text-white hover:text-black rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:cursor-pointer transition-all ease-in-out ">
                                <svg aria-hidden="true" className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-black dark:group-hover:text-black" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                                <span className="ml-3  ">Inicio</span>
                            </a>
                        </li>

                        <li onClick={e => tasklist(e)} className='hover:animate-pulse hover:pl-3'>
                            <a className="flex items-center p-2 py-6 text-white hover:text-black rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:cursor-pointer transition-all ease-in-out ">
                                <svg aria-hidden="true" className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-black dark:group-hover:text-black" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                                <span className="ml-3  ">Tasks</span>
                            </a>
                        </li>



                        <li onClick={e => getnotademi(e)} className='hover:animate-pulse hover:pl-3'>
                            <a className="flex items-center p-2  py-6 text-white hover:text-black rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:cursor-pointer transition-all ease-in-out ">
                                <svg className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path kelinecap="round" kelinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"></path>
                                </svg>
                                <span className="flex-1 ml-3 whitespace-nowrap">notas</span>
                            </a>
                        </li>
                        <li onClick={e => handlerconference(e)} className='hover:animate-pulse hover:pl-3'>
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


            {logindiv ? <div className="absolute w-full h-screen  bg-slate-600  ">
                <div className="flex flex-col p-3 sm:w-4/5 m-auto gap-3 sm:px-44 sm:py-12">
                    <h1 className='text-blue-500 text-8xl mb-12 font-bold'>Sociales</h1>
                    <h2 className='text-blue-500 text-xl font-semibold mt-4'>Descripcion:</h2>

                    <p className='text-slate-400'>La materia de Sociales tiene como objetivo proporcionar a los estudiantes una comprensión profunda de las ciencias sociales, su importancia y cómo se aplican en la vida diaria. A través de esta materia, los estudiantes tendrán la oportunidad de explorar diversos temas, como la historia, la geografía, la economía, la política y la sociología.</p>
                    <h2 className='text-blue-500 text-xl font-semibold mt-4'>Objetivos de la materia:</h2>
                    <ul className='flex pl-5 flex-col gap-2 text-slate-400 list-decimal'>
                        <li className=''>Comprender y analizar la influencia que tienen las ciencias sociales en la sociedad y el mundo en general.</li>
                        <li className=''>Desarrollar habilidades críticas y analíticas para la interpretación de hechos sociales y la toma de decisiones informadas.</li>
                        <li className=''>Adquirir conocimientos sobre la historia, geografía, economía, política y sociología de diferentes culturas y regiones.</li>
                        <li className=''>Desarrollar una comprensión profunda y una apreciación por la diversidad cultural.</li>
                    </ul>
                    <h2 className='text-blue-500 text-xl font-semibold mt-4'>Horario de la materia:</h2>
                    <p className='text-slate-400'>La materia de Sociales se imparte los días lunes, miércoles y viernes de 10:00 a 11:30 AM.</p>

                </div>
            </div> : null}

            {listdiv ? <div className="absolute w-full flex flex-wrap sm:w-1/3 sm:ps-64  bg-slate-600  ">
                {listtask.map(task =>

                    <div key={task.id} className='flex rounded flex-col  px-6 bg-slate-500 my-5 py-5'>

                        <div className='flex items-center justify-between'>
                            <h2 className='font-semibold text-3xl'>{task.name}</h2>
                            <div className='flex flex-rap gap-2'>
                                <h2 className='text-xs bg-green-500 text-white font-bold p-2 rounded-md'>Sociales</h2>
                                <h2 className='text-xs bg-amber-600 font-bold p-2 rounded-md'>{task.fecha}</h2>

                            </div>
                        </div>
                        <p className='mt-3 font-semibold text-xl'>Descripcion:</p>
                        <textarea className='bg-slate-900 text-white p-0 my-3 h-48 ps-3 pt-3' value={task.description} disabled>{task.description}</textarea>

                        <input onChange={e => handleruploadfile(e)} data-task={task.name} type='file' id={task.id} className='bg-slate-400 py-0 mt-4' />
                        <button className='bg-slate-400 py-2 mt-3 hover:bg-black hover:text-white transition-all ease-in'>Subir archivo</button>
                    </div>

                )}
            </div> : null}

            {notasdiv ? <div className="absolute w-full flex flex-wrap sm:w-1/3 sm:ps-64  bg-slate-600  ">
                {nota.map(task =>

                    <div key={task.id} className='flex rounded m-auto flex-col  px-6 bg-slate-500 my-5 py-5'>

                        <div className='flex flex-col gap-3 items-center justify-between'>
                            <h1 className='text-3xl font-semibold text-slate-200'>Nota final de la materia:</h1>
                            {task.nota > 60 ? <h2 className='font-semibold text-5xl mb-3 text-blue-300'>{task.nota}</h2> : <div className='flex gap-2'>Reprobado: <p className='text-red-500 font-bold'>{task.nota}</p> </div>}
                            <div className='flex flex-rap gap-2'>
                                <h2 className='text-xs bg-green-500 text-white font-bold p-2 rounded-md'>Sociales</h2>


                            </div>
                        </div>

                    </div>

                )}
            </div> : null}

            {conferencediv ? <div className="absolute w-full flex flex-wrap sm:w-1/3 sm:ps-64  bg-slate-600  ">
                {conferencelist.map(task =>

                    <a  href={task.link} target='_blank' key={task.id} className='flex rounded m-auto flex-col  px-6 bg-slate-500 my-5 py-5'>
                        <p className='text-sm text-center my-3 border border-black'>Sociales</p>

                        <div className='flex flex-col gap-3 items-center justify-between'>
                            <h1 className='text-3xl font-semibold text-slate-200 text-center'>{task.title}</h1>
                           
                            <div className='flex flex-rap gap-2'>
                                <h2 className='text-xs bg-green-500 text-white font-bold p-2 rounded-md'>Abrir</h2>


                            </div>
                        </div>

                    </a>

                )}
            </div> : null}



        </div>

    )
}

export default Student