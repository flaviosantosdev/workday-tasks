import styles from './styles.module.scss'
import {FaGithub} from 'react-icons/fa'
import { FiX } from 'react-icons/fi'
import { useSession, signIn, signOut, getSession } from "next-auth/react"
import { GetServerSideProps } from 'next'

export function SignInButton(){

    const { data: session } = useSession()

    console.log(session)

    return session ?
    (
        <button type="button" 
         className={styles.signInButton}
         onClick={() => signOut()}
         >
         <img src={session.user.image} alt="flavio santos" />   
          {session.user.name}
          <FiX color="#1f1c1c" />
        </button>
    ):
    <>
         
            <button type="button" 
            className={styles.signInButton}
            onClick={() => signIn('github')}>
            <FaGithub color="#12a02a" />
            Acesse com github
            </button>
        </> 
}


