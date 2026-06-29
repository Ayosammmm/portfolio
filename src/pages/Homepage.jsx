import HeroHome from '../sections/HeroHome';
import Competences from '../sections/Competences';
import BlogPub from '../sections/BlogPub';
import Jefaisquoi from '../sections/Jefaisquoi';
import CtaProjets from '../sections/CtaProjets';
import Dither from '../components/Dither';

import '../scss/Homepage.scss';

export default function Homepage() {
    return (<section className='homepage'>
        <HeroHome />
        {/* <Competences />
        <BlogPub />
        <Jefaisquoi />
        <CtaProjets /> */}
    </section>)
}