import Link from "next/link";
import styles from './styles.module.scss'

export function ButtonSupport(){


    return(
        <div className={styles.donateContainer}>
            <Link href="/donaters">
                <button>
                APOIAR
              </button>
            </Link>
        </div>
    )
}