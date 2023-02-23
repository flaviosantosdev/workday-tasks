import styles from './styles.module.scss'
import Head from 'next/head'
import {useState} from 'react'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { PayPalButtons } from '@paypal/react-paypal-js'
import firebase from '../../services/firebaseConnection'

interface DonateProps{
    user:{
        nome: string
        id:string,
        image:string

    }
}


export default function Donate({ user }: DonateProps){
    const[vip, setVip] = useState(false)


    async function handleSaveDonate(){
        await firebase.firestore().collection('users')
        .doc(user.id)
        .set({
            donate:true,
            lastDOnate: new Date(),
            image: user.image
        }).then(() => {
            setVip(true)
        })
    }

    return(
        <>
            <Head>
                <title>Nos apoie</title>
            </Head>

            <main className={styles.container}>
                <img src='images/done.png' />

                {vip && (
                    <div className={styles.vip}>
                    <img src={user.image} alt={user.nome} />
                      <span>Parabens voce ja está apoiando</span>
                    </div>
                )}

                <h1>Seja um apoiador</h1>
                <h3>Contribua com apenas <span> R$ 1,00</span></h3>
                <strong>Aparença na nossa lista</strong>
                <PayPalButtons
                    createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units:[{
                            amount:{
                                value:'1'
                            }
                          }]  
                        })
                    }}
                    onApprove={ (data, actions)=> {
                        return actions.order.capture().then(function(details){
                            console.log('compra aprovada')
                            handleSaveDonate()
                        })
                    }}
                />
            </main>
        </>
    )
}


export const getServerSideProps : GetServerSideProps = async ({ req }) => {

    const session = await getSession({ req })

    if(!session?.user.email){
        return {
            redirect:{
                destination:"/",
                permanent: false
            }
        }
    }   
    
    const user = {
        nome: session?.user.name,
        id:session?.user.email,
        image:session?.user.image
    }

    return{
        props:{
            user
        }

    }

}