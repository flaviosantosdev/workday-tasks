import styles from './styles.module.scss'
import Head from 'next/head'
import {FiCalendar, FiClock, FiEdit2, FiPlus,FiTrash, FiX } from 'react-icons/fi'
import { ButtonSupport } from '../../components/ButtonSupport'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { FormEvent, useState } from 'react'
import firebase from '../../services/firebaseConnection'
import format from 'date-fns/format'
import Link from 'next/link'

type TaskList = {
    id: string;
    created: string | Date;
    createdFormated?:string;
    tarefa:string;
    userId:string;
    nome: string;
}

interface WorkProps {
    user:{
        id:string;
        nome:string
    }
    data: string
}

// AZpnP_-jllbcpBGZXVDhhwTTD9F1mlr9cSArJtL4-Zm9RK6zqzFScn2fdIIHbFELZBGTiPZuhMDlJ0iO
 //<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>
export default function Work({user, data}: WorkProps){

    const [input, setInput] = useState('')
    const [taskList, setTaskList] = useState<any>(JSON.parse(data))
    const [taskEdit, settaskEdit] = useState<TaskList | null>(null)

    async function handleSubmit(e: FormEvent){
        e.preventDefault()
        
        if(input === ''){
            alert('escreva a terera')
            return
        }

        if(taskEdit){
            await firebase.firestore().collection('tarefas')
            .doc(taskEdit.id)
            .update({
                tarefa:input
            })
            .then(() => {
                let data = taskList;
                let taskIndex =  taskList.findIndex(item => item.id === taskEdit.id)
                data[taskIndex].tarefa = input

                setTaskList(data)
                settaskEdit(null)
                setInput('')
            })


            return;
        }

        await firebase.firestore().collection('tarefas')
        .add({
            created:new Date(),
            tarefa: input,
            userId: user.id,
            nome: user.nome
        })
        .then((doc) => {
            console.log("cadastrado")
            let data = {
                id:doc.id,
                created:new Date(),
                createdFormated: format(new Date(), 'dd MMMM yyyy'),
                tarefa:input,
                nome: user.nome
            }
            setTaskList([...taskList,data])
            setInput('')
        })
        .catch((err) => {
            console.log('erro',err)
        })
        
    }

    async function handleDelete(id){
        await firebase.firestore().collection('tarefas').doc(id)
            .delete()
            .then(() => {
                console.log("deletado")
                let taskDeleted = taskList.filter( item => {
                    return (item.id !== id)
                })
                setTaskList(taskDeleted)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    async function handleEdit(task: TaskList) {
            setInput(task.tarefa)
            settaskEdit(task)
    }

    function handleCancelEdit(){
        setInput('')
        settaskEdit(null)
    }
    return(
        <> 
        <Head>
        <title>my works</title>
        </Head>
            <main className={styles.container}>

                {taskEdit && (
                    <span className={styles.warnText}>Voce esta editando <button onClick={handleCancelEdit}><FiX color={"red"} size={30} /></button></span>
                )}
                <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      placeholder="Coloque sua terfa"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      />

                    <button type='submit'>
                    <FiPlus color="#2b2816" size={25} />
                    </button>
                </form>

                <h1> {taskList.length == 1 ? 'Voce tem 1 tarefa' : `Voce tem ${taskList.length} tarefas`} </h1>

                <section>
                    {taskList.map( task => (
                         <article key={task.id} className={styles.taskList}>
                         <Link href={`/work/${task.id}`}>
                            <p>{task.tarefa}</p>
                         </Link>
                             <div className={styles.actions}>
                                <div>
                                 <div>
                                     <FiCalendar size={20} color="#bac249" />
                                     <time>{task.createdFormated}</time>
                                 </div>
                                 <button onClick={() => {
                                    handleEdit(task)
                                 }}>
                                     <FiEdit2 size={20} color="#fff" />
                                     <span>Editar</span>
                                 </button>
                             </div>
 
                             <button onClick={() => {handleDelete(task.id)}}>
                                 <FiTrash size={20} color="#be311ec9" />
                                 <span>Excluir</span>
                             </button>
                         </div>
                     </article>
                    ))
                    
                    }

                   
                </section>
            </main>

            <div className={styles.vipContainer}>
                <h3>Obrigado</h3>
                <div>
                    <FiClock size={20} color="#fff" />
                    <time>Ultimo apoio foi a 3 dias</time>
                </div>
            </div>
            <ButtonSupport />
        </>
    )
}

export const getServerSideProps : GetServerSideProps = async ({ req }) => {
    const session = await getSession({req}) ;       

    
    if(!session?.user.email){
        return {
            redirect:{
                destination:"/",
                permanent: false
            }
        }
    }   
   
    const tasks = await firebase.firestore().collection('tarefas')
    .where('userId', '==' ,session?.user.email)
    .orderBy('created', 'asc').get()

    const data = JSON.stringify(tasks.docs.map(u => {
        return {
            id: u.id,
            createdFormated: format(u.data().created.toDate(), 'dd MMMM yyyy'),
        ...u.data(),
    }
    
  }))

    const user = {
        nome: session?.user.name,
        id:session?.user.email
    }
    return {
        props:{
           user,
           data
        }
    }

}