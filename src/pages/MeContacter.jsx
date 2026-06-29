import SocialsBubble from '../components/SocialsBubble';
import TextType from '../components/TextType';
import '../scss/MeContacter.scss';

export default function Moi() {
    return (<section className="contact-page">
        <div className="container">
            <h1 className='title-bandeau'>
                <TextType
                    text={[
                        "Je suis (parfois) actif sur ces réseaux :",
                        "Oui car j'essaye d'éviter le doomscrolling...",
                        "Un jour je redeviens actif sur Youtube",
                        "Je suis timide mais je ne mords pas !",
                        "Il y a ma boite mail pour les \"contacts pro\"",
                        "Sur Github j'ai rien publié mdr",
                        "C'est rigolo je peux écrire pleins de trucs",
                        "Je ne suis pas le seul à trouver ca drole on dirait",
                        "Raison de plus pour me dire coucou mdrrr"]}
                    typingSpeed={75}
                    pauseDuration={2500}
                    showCursor={true}
                    cursorCharacter="|"
                />
            </h1>
            <div className="socials-bubbles-container">
                <SocialsBubble
                    href="https://www.youtube.com/@breaksam0"
                    rotate="-30"
                    decayX="20"
                    decayY="120"
                    scale="0.9"
                    color="#FF2714">
                    <img src="/assets/socials/youtube.svg" width="140" height="140" />
                </SocialsBubble>
                <SocialsBubble
                    href="https://www.instagram.com/ayosammmm"
                    rotate="30"
                    decayX="0"
                    decayY="-40"
                    scale="1.1"
                    color="#FF14D4"
                    svgIcon='instagram'>
                    <img src="/assets/socials/instagram.svg" width="140" height="140" />
                </SocialsBubble>
                <SocialsBubble
                    href="mailto:sambensalah68290@gmail.com"
                    rotate="10"
                    decayX="0"
                    decayY="160"
                    color="#E2E2E2"
                    svgIcon='mail'>
                    <img src="/assets/socials/mail.svg" width="140" height="140" />
                </SocialsBubble>
                <SocialsBubble
                    href="https://github.com/Ayosammmm"
                    decayX="-10"
                    decayY="-10"
                    rotate="40"
                    scale={1.2}
                    color="#14A5FF"
                    svgIcon='github'>
                    <img src="/assets/socials/github.svg" width="140" height="140" />
                </SocialsBubble>
            </div>
        </div>
    </section>)
}