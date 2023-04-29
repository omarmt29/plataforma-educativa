import React, { useEffect, useState } from 'react'
import { supabase } from './supabase/supabase'
import { useNavigate } from "react-router-dom";
import { FaBars } from 'react-icons/fa';

function Dashboard() {

    const navegacion = useNavigate();

    const [newtask, setnewtask] = useState({ id: '', name: '', description: '', fecha: '', zoom: '' });
    const [newzoom, setnewzoom] = useState({ title: '', zoom: '' });
    const [insertprofile, setinsertprofile] = useState({ nota: '' });

    const [asignar, setasignar] = useState(false);
    const [menu, setmenu] = useState('');
    const [alertupdate, setalertupdate] = useState(' ');

    const [listtask, setlisttask] = useState([]);
    const [conferencelist, setconferencelist] = useState([]);

    const [filelist, setfilelist] = useState({});
    const [profile, setprofile] = useState({});
    const [archivosdiv, setarchivosdiv] = useState(false);
    const [tasklistdiv, settasklistdiv] = useState(false);
    const [notadiv, setnotadiv] = useState(false);
    const [zoomdiv, setzoomdiv] = useState(false);

    const [logindiv, setlogindiv] = useState(true);


    // verificar si tienes permitido ver el dashboard

    useEffect(() => {

        const getsession = async () => {

            const { data, error } = await supabase.auth.getSession()


            if (data.session && data.session.user.email !== 'omarmendezt29@gmail.com') {

                navegacion('/')
            } else if (!data.session) {
                console.log('no hay ni mielda')
                navegacion('/')
            }

            // if(!data.session && !data.session.user.email == 'omarmendezt29@gmail.com'){
            //   console.log('soy estudiante')
            // }


        }
        getsession()
    }, [])


    // archivos handlers

    const handlerarchivoslist = async (e) => {
        e.preventDefault()
        // recibo la lista de archivos pero sin url

        const { data, error } = await supabase
            .storage
            .from('files')
            .list('tareas', {
                limit: 100,
                sortBy: { column: 'name', order: 'desc' }
            })
        setfilelist(data)
        console.log(error)
        setarchivosdiv(true)
        settasklistdiv(false)
        setasignar(false)
        setzoomdiv(false)
        setnotadiv(false)
        // 'https://emfjomsevzoytidqbiih.supabase.co/storage/v1/object/public/files/tareas/' + data[1].name


    }

    const handlerdeletearchivo = async (e) => {
        const { data, error } = await supabase
            .storage
            .from('files')
            .remove(['tareas/' + e.target.id])

        if (!error) {
            const { data, error } = await supabase
                .storage
                .from('files')
                .list('tareas', {
                    limit: 100,
                    sortBy: { column: 'name', order: 'desc' }
                })
            setfilelist(data)

        }
    }



    // task handlers

    const handlerdivtareas = async (e) => {
        setasignar(!asignar)
        settasklistdiv(false)
        setarchivosdiv(false)
        setnotadiv(false)
        setzoomdiv(false)
        const { data } = await supabase.from('task').select().order('id', { ascending: false });
        setlisttask(data)


    }
    const handlercreatenewtask = async (e) => {
        e.preventDefault()

        const { data, error } = await supabase
            .from('task')
            .insert({ name: newtask.name, description: newtask.description, fecha: newtask.fecha })
        tasklist()

    }

    const tasklist = async (e) => {
        const { data } = await supabase.from('task').select().order('id', { ascending: false });
        setlisttask(data)

    }
    const handlerupdatetask = async (e) => {
        e.preventDefault()

        const { error } = await supabase
            .from('task')
            .update({ name: newtask.name, description: newtask.description, fecha: newtask.fecha })
            .eq('id', e.target.id)
        console.log(error)
        if (!error) {
            setalertupdate('Tarea actualizada');
            setTimeout(function () {
                setalertupdate(" ");
            }, 3000); // 3000 milisegundos = 3 segundos
        }

    }

    const handlerdeletetask = async (e) => {
        const { error } = await supabase
            .from('task')
            .delete()
            .eq('id', e.target.id)

        if (!error) {
            const { data, error } = await supabase
                .from('task')
                .select()
            setconferencelist(data)
        }
    }




    // zoom handlers

    const handlernewzoom = async (e) => {
        e.preventDefault()

        const { data, error } = await supabase
            .from('conference')
            .insert({ title: newzoom.title, link: newzoom.link })

        if (!error) {
            setalertupdate('Conferencia publicada con exito');
            setTimeout(function () {
                setalertupdate(" ");
            }, 3000); // 3000 milisegundos = 3 segundos

            const { data, error } = await supabase
                .from('conference')
                .select()
            // console.log(data)
            setconferencelist(data)
        }

    }

    const handlerzoomdelete = async (e) => {
        const { error } = await supabase
            .from('conference')
            .delete()
            .eq('id', e.target.id)

        if (!error) {
            const { data, error } = await supabase
                .from('conference')
                .select()
            setconferencelist(data)
        }

    }

    const handlerzoomdiv = async (e) => {
        e.preventDefault()
        setnotadiv(false)
        setasignar(false)
        settasklistdiv(false)
        setarchivosdiv(false)
        setzoomdiv(!zoomdiv)
        const { data, error } = await supabase
            .from('conference')
            .select()
        // console.log(data)
        setconferencelist(data)

    }



    // menu handlers

    function handlerhandleLogout(e) {
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



    // notas handlers

    const handlernotas = async (e) => {
        e.preventDefault()
        const { data, error } = await supabase
            .from('profile')
            .select()
        console.log(data)
        setprofile(data)
        setzoomdiv(false)

        setnotadiv(!notadiv)
        setasignar(false)
        settasklistdiv(false)
        setarchivosdiv(false)

    }

    const handlerdeletnotas = async (e) => {

        const { error } = await supabase
            .from('profile')
            .delete()
            .eq('email', e.target.id)
        if (!error) {
            const { data, error } = await supabase
                .from('profile')
                .select()
            setprofile(data)
        }
    }

    const handlerupdatenotas = async (e) => {
        const { error } = await supabase
            .from('profile')
            .update({ nota: insertprofile.nota })
            .eq('email', e.target.id)
        if (!error) {
            const { data, error } = await supabase
                .from('profile')
                .select()
            setprofile(data)
        }
    }


    // login div handler

    const handlerlogindiv = async (e) => {
        setlogindiv(true)
        setnotadiv(false)
        setasignar(false)
        settasklistdiv(false)
        setarchivosdiv(false)
        setzoomdiv(false)

    }



    return (
        <div className='w-full grid grid-cols-12 h-screen bg-slate-900'>
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

                        <li onClick={e => handlerdivtareas(e)} className='hover:animate-pulse hover:pl-3'>
                            <a className="flex items-center p-2  py-6 text-white hover:text-black rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:cursor-pointer transition-all ease-in-out ">
                                <svg className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path kelinecap="round" kelinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25"></path>
                                </svg>
                                <span className="flex-1 ml-3 whitespace-nowrap">Asignar tareas</span>
                            </a>
                        </li>

                        <li onClick={e => handlerarchivoslist(e)} className='hover:animate-pulse hover:pl-3'>
                            <a className="flex items-center p-2  py-6 text-white hover:text-black rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:cursor-pointer transition-all ease-in-out ">
                                <svg className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path kelinecap="round" kelinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"></path>
                                    <path kelinecap="round" kelinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                <span className="flex-1 ml-3 whitespace-nowrap">Archivos</span>
                            </a>
                        </li>
                        <li onClick={e => handlernotas(e)} className='hover:animate-pulse hover:pl-3'>
                            <a className="flex items-center p-2  py-6 text-white hover:text-black rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:cursor-pointer transition-all ease-in-out ">
                                <svg className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path kelinecap="round" kelinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"></path>
                                </svg>
                                <span className="flex-1 ml-3 whitespace-nowrap">Publicar notas</span>
                            </a>
                        </li>
                        <li onClick={e => handlerzoomdiv(e)} className='hover:animate-pulse hover:pl-3'>
                            <a className="flex items-center p-2  py-6 text-white hover:text-black rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:cursor-pointer transition-all ease-in-out ">
                                <svg className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path kelinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"></path>
                                </svg>

                                <span className="flex-1 ml-3 whitespace-nowrap">Videoconferencia</span>
                            </a>
                        </li>

                        <li className='hover:animate-pulse hover:pl-3'>
                            <a onClick={e => handlerhandleLogout(e)} className="flex items-center p-2  py-6 text-white hover:text-black rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:cursor-pointer transition-all ease-in-out ">
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

            {asignar ? <div className="absolute w-full h-screen  bg-slate-600  ">
                <div className="flex flex-col p-3 sm:w-4/5 m-auto gap-3 sm:p-12">
                    <h1 className='text-center text-white font-bold text-xl mt-5'>Insertar task</h1>
                    <div className='flex flex-col m-auto w-full gap-3 mb-5'>
                        <input onChange={e => setnewtask({ ...newtask, name: e.target.value })} className='bg-slate-500 text-white placeholder-slate-50' type="text" name='titulo' placeholder='Titulo' />
                        <textarea onChange={e => setnewtask({ ...newtask, description: e.target.value })} className='h-72 resize-none bg-slate-500 text-white placeholder-slate-50' type="text" name='Descripcion' placeholder='Descripcion' />
                        <input onChange={e => setnewtask({ ...newtask, fecha: e.target.value })} className='bg-slate-500 text-white placeholder-slate-50' type="text" name='fecha' placeholder='Fecha de entrega' />

                        <button onClick={e => handlercreatenewtask(e)} className='bg-black py-3 text-white hover:bg-slate-800 '>Insert task</button>

                    </div>

                    <h2 className='text-center text-white font-bold text-xl mt-5'>Lista de tareas</h2>
                    {alertupdate == " " ? null : <p className='transition-all ease-out text-center text-white font-bold text-xl mt-5 bg-green-400  border-green-300 border-spacing-4 border-2 rounded-md w-64 py-3 m-auto'>{alertupdate}✅</p>}
                    <div className='flex gap-3 flex-wrap'>
                        {listtask.map(task =>

                            <div key={task.id} className='flex rounded  gap-1 w-full sm:w-full md:w-full lg:w-1/5  flex-col  px-6  my-5 py-5 bg-slate-700 p-5'>

                                <input className='py-3 border border-black rounded-md' onChange={e => setnewtask({ ...newtask, name: e.target.value })} name='name' placeholder={task.name} type="text" />
                                <input className='py-3 border border-black rounded-md' onChange={e => setnewtask({ ...newtask, fecha: e.target.value })} name='fecha' type="text" placeholder={task.fecha} />
                                <textarea classNamer='rounded-xl' onChange={e => setnewtask({ ...newtask, description: e.target.value })} name='description' placeholder={task.description} className='text-black'>
                                    {task.description}
                                </textarea>
                                <div className='flex flex-wrap  '>
                                    <button onClick={e => handlerupdatetask(e)} id={task.id} className='bg-green-500 border text-white transition-all ease-in border-white w-1/2   py-3 mt-2 hover:bg-black hover:text-white'>Update task</button>
                                    <button onClick={e => handlerdeletetask(e)} id={task.id} className='bg-red-500 border text-white transition-all ease-in border-white w-1/2   py-3 mt-2 hover:bg-black hover:text-white'>Delete task</button>
                                </div>
                            </div>


                        )}
                    </div>
                </div>
            </div> : null}

            {notadiv ? <div className="absolute w-full h-screen  bg-slate-600 ">

                <div className='flex flex-col p-12 sm:w-2/3 m-auto gap-3 sm:p-12'>

                    <div className='mt-5 flex gap-3 flex-wrap'>
                        {profile.map(profile => <div className='w-80 bg-slate-700 p-3' >
                            <h2 className='text-white text-xl my-3 '>{profile.email}</h2>
                            <input type="text" placeholder='Escribir nota' className='w-full' onChange={e => setinsertprofile({ ...insertprofile, nota: e.target.value })} />
                            <h1 className='text-yellow-300 text-4xl text-center mb-4 font-bold'>{profile.nota}</h1>
                            <div className='flex flex-warp'>
                                <button onClick={e => handlerdeletnotas(e)} id={profile.email} className='bg-red-500 text-white p-2 w-full'>Eliminar</button>
                                <button onClick={e => handlerupdatenotas(e)} id={profile.email} className='bg-green-500 text-white p-2 w-full'>Actualizar</button>
                            </div>

                        </div>)}
                    </div>
                </div>


            </div> : null}

            {archivosdiv ? <div className="absolute w-full h-screen  bg-slate-600 ">

                <div className='flex flex-col p-12 sm:w-2/3 m-auto gap-3 sm:p-12'>
                    <h1 className='text-white text-2xl'>Lista de archivos por estudiantes</h1>
                    {filelist.map(file => <div className='flex flex-col'>

                        <ol className='text-red list-disc list-inside'>
                            <li className='mt-4 list-disc flex flex-col sm:flex sm:flex-row gap-3 items-center'>
                                📽️
                                <a className='text-gray-400 hover:text-gray-200' target='_blank' href={'https://emfjomsevzoytidqbiih.supabase.co/storage/v1/object/public/files/tareas/' + file.name}>{file.name}</a>
                                <button onClick={e => handlerdeletearchivo(e)} id={file.name} className='bg-red-500 p-3 rounded text-white w-full sm:w-auto'>Eliminar</button>
                                <a className='bg-green-500 p-3 rounded text-center text-white w-full sm:w-auto' href={'https://emfjomsevzoytidqbiih.supabase.co/storage/v1/object/public/files/tareas/' + file.name}>Ver archivo</a>
                            </li>
                        </ol>
                    </div>)}
                </div>

            </div> : null}

            {zoomdiv ? <div className="absolute w-full h-screen  bg-slate-600 ">
                <div className='flex flex-col p-12 sm:w-2/3 m-auto gap-3 sm:p-12'>

                    {alertupdate == " " ? null : <p className='transition-all ease-out text-center text-white font-bold text-xl mt-5 bg-green-400  border-green-300 border-spacing-4 border-2 rounded-md w-96 py-3 m-auto'>{alertupdate}✅</p>}
                    <h1 className='text-white text-2xl'>Subir videoconferencia</h1>
                    <input className='bg-slate-500' type="text" required placeholder='Titulo' onChange={e => setnewzoom({ ...newzoom, title: e.target.value })} />
                    <input className='bg-slate-500' type="text" required placeholder='Ejemplo: https://meet.google.com/ojz-wcmx-eve' name='link' onChange={e => setnewzoom({ ...newzoom, link: e.target.value })} />
                    <div className='w-20'>
                        <button onClick={e => handlernewzoom(e)} className='bg-black text-white transition ease-out py-2 px-4 rounded'>Publicar</button>
                    </div>


                    <div className='mt-5 flex gap-2 flex-wrap'>
                        {conferencelist.map(link => <div className='w-80 bg-slate-700 p-3' >
                            <h2 className='text-white text-xl '>{link.title}</h2>
                            <h2 className='text-white mb-3  '>{link.link}</h2>
                            <button onClick={e => handlerzoomdelete(e)} id={link.id} className='bg-red-500 text-white p-2 w-full'>Eliminar</button>

                        </div>)}
                    </div>
                </div>


            </div> : null}

            {tasklistdiv ? <div className='absolute w-full h-screen top-0  bg-slate-600 sm:p-16'>
                <h2 className='text-center text-white font-bold text-xl mt-5'>Lista de tareas</h2>
                {alertupdate == " " ? null : <p className='transition-all ease-out text-center text-white font-bold text-xl mt-5 bg-green-400  border-green-300 border-spacing-4 border-2 rounded-md w-64 py-3 m-auto'>{alertupdate}✅</p>}
                {listtask.map(task =>
                    <div key={task.id} className='flex rounded gap-1 sm:w-2/5 m-auto flex-col  px-6  my-5 py-2'>

                        <input className='py-3 border border-black rounded-md' onChange={e => setnewtask({ ...newtask, name: e.target.value })} name='name' placeholder={task.name} type="text" />
                        <input className='py-3 border border-black rounded-md' onChange={e => setnewtask({ ...newtask, fecha: e.target.value })} name='fecha' type="text" placeholder={task.fecha} />
                        <textarea classNamer='rounded-xl' onChange={e => setnewtask({ ...newtask, description: e.target.value })} name='description' placeholder={task.description} className='text-black'>
                            {task.description}
                        </textarea>
                        <button onClick={e => handlerupdatetask(e)} id={task.id} className='bg-transparent border text-white transition-all ease-in border-white   py-3 mt-2 hover:bg-black hover:text-white'>Update task</button>
                    </div>


                )}
            </div> : null}

        </div>

    )
}

export default Dashboard