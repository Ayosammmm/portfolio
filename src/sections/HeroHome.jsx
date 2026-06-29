import { Link } from "react-router-dom"

export default function HeroHome() {
    return (
        <section className="hero-home">
            <div className="hero-home__content container">
                <h1>Hello, et bienvenue<br /> sur mon portfolio !</h1>

                <div className="os-window">
                    <div className="os-window__titlebar">
                        {/* <div className="os-window__dots">
                            <span className="dot dot--close" />
                            <span className="dot dot--minimize" />
                            <span className="dot dot--maximize" />
                        </div> */}
                        <span className="os-window__title">a_propos.txt</span>
                    </div>
                    <div className="os-window__body">
                        <p>Oui vous êtes sur un énième portfolio fait par un énième créatif.</p>
                        <p>Cependant, si vous êtes curieux, je vous invite à voir mes créations parmi la masse de contenus publiés sur le net.</p>
                        <p><u>Je fais quoi ?</u></p>
                        <p>Pour faire court, je suis un passionné de création informatique.<br />Du développement de sites web, au montage, en passant par la 3D, l’infographie et le son, j’étend mon savoir faire et mon panel de techniques dans le but de découvrir des choses, mais surtout de rendre réel ce que j’imagine.</p>
                        <p>J’assimile toujours plus de compétences dans le but d’avoir une porte d’entrée à d’autres compétences plus compliquées d’accès. Ce qui me permet de me démarquer et de proposer des choses que tout le monde ne propose pas.</p>
                        <p><u>Qui suis-je ?</u></p>
                        <p>Je suis un geek dans sa bulle. J’ai depuis ma plus tendre enfance cet envie de créer des mondes et je faisais de différents contenus en passant sur des jeux comme Music 2000, Far Cry et son édition de maps, ou Minecraft.</p>
                        <p>Puis un jour, j'ai grandi et je me suis trouvé une passion à créer des trucs avec des logiciels (FL Studio pour la musique, Photoshop, Premiere et After Effects, puis Davinci, Blender..), puis j'ai découvert le code. D'abord avec les commands blocks sur Minecraft, puis sur VSCode.</p>
                        <p>Voilà ! Si vous avez tout lu, bravo. Vous avez plus de capacités d'attention que la majorité des gens je suppose :)</p>
                    </div>
                </div>

                <div className="hero-home__btns">
                    <Link to='/creations' viewTransition className="btn btn-primary">Mes créations</Link>
                    <Link to='/contact' viewTransition className="btn btn-primary">Me contacter</Link>
                </div>
            </div>
        </section>
    );
}