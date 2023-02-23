import { GetStaticProps } from 'next'
import Head from 'next/head'
import styles from '../styles/home.module.scss'
import firebase from '../services/firebaseConnection'
import { useState } from 'react'

type Data ={
  id:string;
  donate: boolean;
  lastDonate: Date;
  image: string;
}

interface Homeprops{
  data: string;
}

export default function Home({ data }: Homeprops) {

  const [donaters, setDonaters] = useState<Data[]>(JSON.parse(data))



  return (
    <>
      <Head>
        <title>Home | Work</title>
      </Head>
      <main className={styles.contentContainer}>
        <img src="/images/work.png"  alt="work" />

        <section className={styles.callToAction}>
          <h1>Suas tarefas diarias, aqui</h1>
          <p>
            Mantenha suas atividades na nuvem
            <span>ONLINE</span>
          </p>
        </section>
        <h3>{donaters ? `Apoiadores` : ""}</h3>
        <div className={styles.donaters}>
          {donaters.map(item => (
            <img key={item.image} src={item.image} alt="user" />

          ))}
        </div>
      </main>
    </>
  )
}


export const getStaticProps: GetStaticProps = async () => {

  const donaters = await firebase.firestore().collection('users').get();
  
  
  const data = JSON.stringify(donaters.docs.map(u => {
    return{
      id:u.id,
      ...u.data(),
    }
  }))

 

  return{
    props:{
      data
    },
    
  }
}