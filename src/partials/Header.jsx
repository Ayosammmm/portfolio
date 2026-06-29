import { Link } from "react-router-dom"

import Logo from '../assets/logomini.svg'
import ChevronUp from '../assets/chevronup.svg'

export default function Header() {
    return (
        <header>
            <div className="hover-arrow">
                <img src={ChevronUp} width="20" height="20" className="logo react" alt="Logo Portfolio" />
            </div>
            <nav>
                <Link to='/creations' viewTransition>Mes créations</Link>
                <Link to='/' className="logo-link" viewTransition>
                    <img src={Logo} width="60" height="60" className="logo react" alt="Logo Portfolio" />
                </Link>
                <Link to='/contact' viewTransition>Me contacter</Link>
            </nav>
        </header>
    )
}