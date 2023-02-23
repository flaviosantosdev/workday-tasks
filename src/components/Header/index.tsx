import Link from 'next/link'
import { SignInButton } from '../SignInButton'
import styles from './styles.module.scss'

export function Header(){

    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
            <Link href="/">   
                <img src="/images/logo.png" alt="logo" />
            </Link>    
            <nav>
                <Link href="/">
                     <span>Home</span>
                </Link>
               
               <Link href="/work">
                <span>My works</span>
               </Link>

                
            </nav>
            <SignInButton />
            </div>
        </header>
    )
}