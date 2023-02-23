import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import firebase from '../../services/firebaseConnection'
import {format} from 'date-fns'
import styles from './task.module.scss'
import Head from "next/head"
import { FiCalendar } from "react-icons/fi"

type Task = {
    id: string;
    created: string | Date;
    createdFormated?:string;
    tarefa: string;
    userId: string;
    nome: string
}

interface TaskListProps{
    data:string
}


export default function Task({data}: TaskListProps){
    const task = JSON.parse(data) as Task


    return(
        <>
            <Head>
                <title>Detalhes tarefa</title>
             </Head>
            <article>
                <div className={styles.container}>
                    <div className={styles.actions}>
                        <FiCalendar size={30} color="#fff" />
                        <span>Tarefa criada:</span>
                        <time>{task.createdFormated}</time>
                    </div>
                    <p>{task.tarefa}</p>
                </div>
               
            </article>
        </>
    )
}

export const getServerSideProps : GetServerSideProps = async ({ req, params }) => {
    const session:any = await getSession({req}) ; 
    const {id} = params      

    
    if(!session?.user.email){
        return {
            redirect:{
                destination:"/",
                permanent: false
            }
        }
    }   
    const data = await firebase.firestore().collection('tarefas')
    .doc(String(id))
    .get()
    .then((snapshot) => {
        const data = {
            id:snapshot.id,
            created:snapshot.data().created,
            createdFormated:format(snapshot.data().created.toDate(), 'dd MMMM yyyy'),
            tarefa: snapshot.data().tarefa,
            userId: snapshot.data().userId,
            nome: snapshot.data().nome
        }

        return JSON.stringify(data)
    })

    return {
        props:{
            data
        }
    }

}