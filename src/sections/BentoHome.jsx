import { useState } from "react";
import { Link } from "react-router-dom";
import projects from "../data/projects";
import Img from "../components/Img";
import { imageFor } from "../js/images";
import { asset } from '../js/asset';

// Projet mis en avant sur la page d'accueil : changer le slug suffit.
const FEATURED_SLUG = "breaksam";
// Projet affiché dans la tuile image secondaire.
const SECONDARY_SLUG = "blenderanim";

// GIF de la tuile en haut à droite (https://giphy.com/embed/uSoDr54W9M3uSBiTST)
const GIF_SRC = "https://media.giphy.com/media/uSoDr54W9M3uSBiTST/giphy.mp4";
const OUTILS = ["FL Studio", "Photoshop", "Premiere Pro", "After Effects", "DaVinci", "Blender", "VSCode", "Illustrator", "React", "Wordpress"];

const SOCIALS = [
    { href: "https://www.youtube.com/@breaksam0", icon: "youtube", label: "YouTube" },
    { href: "https://www.instagram.com/ayosammmm", icon: "instagram", label: "Instagram" },
    { href: "https://github.com/Ayosammmm", icon: "github", label: "GitHub" },
];

// Nombre de bandeaux empilés dans la tuile "Mes outils"
const MARQUEE_ROWS = 5;

const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

export default function BentoHome() {
    // Ordre aléatoire + vitesse légèrement différente par bandeau, tiré une seule fois au montage
    const [marqueeRows] = useState(() =>
        Array.from({ length: MARQUEE_ROWS }, () => ({
            items: shuffle(OUTILS),
            duration: 25 + Math.round(Math.random() * 14),
        }))
    );

    const featured = projects.find((p) => p.slug === FEATURED_SLUG);
    const secondary = projects.find((p) => p.slug === SECONDARY_SLUG);

    return (
        <section className="bento-home section-in-stagger">
            {/* Intro */}
            <article className="bento-tile bento-tile--intro">
                <span className="bento-label">a_propos.txt</span>
                <h1>Hello, et bienvenue<br /> sur mon portfolio !</h1>
                <p>
                    Oui, vous êtes sur un énième portfolio fait par un énième créatif.
                    Mais si vous êtes curieux, je vous invite à voir mes créations
                    parmi la masse de contenus publiés sur le net.
                </p>
            </article>

            {/* Projet à la une */}
            {featured && (
                <article
                    className="bento-tile bento-tile--featured"
                    style={{ "--bg": `url('${imageFor(featured.bg || featured.cover, 1280)}')`, "--accent": featured.color }}
                >
                    <span className="bento-label">Projet à la une</span>
                    <div className="bento-featured__content">
                        <div className="bento-featured__tags">
                            {featured.tags.map((tag) => (
                                <span key={tag} className="bento-chip">{tag}</span>
                            ))}
                        </div>
                        <h2>{featured.title}</h2>
                        <p className="bento-featured__subtitle">{featured.subtitle}</p>
                        <div className="bento-featured__btns">
                            <Link to={`/creations/${featured.slug}`} viewTransition className="btn btn-primary">
                                Découvrir le projet
                            </Link>
                            <Link to="/creations" viewTransition className="bento-link">
                                Toutes mes créations →
                            </Link>
                        </div>
                    </div>
                </article>
            )}

            {/* GIF (version MP4 de Giphy : ~100 Ko au lieu de ~2 Mo pour le .gif) */}
            <div className="bento-tile bento-tile--gif" aria-hidden="true">
                <video src={GIF_SRC} autoPlay muted loop playsInline preload="auto" />
            </div>

            {/* Image secondaire */}
            {secondary && (
                <Link
                    to={`/creations/${secondary.slug}`}
                    viewTransition
                    className="bento-tile bento-tile--image"
                >
                    <Img src={secondary.cover} alt={secondary.title} sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" />
                    <span className="bento-image__caption">{secondary.title} →</span>
                </Link>
            )}

            {/* Je fais quoi ? */}
            <article className="bento-tile bento-tile--quoi">
                <span className="bento-label">Je fais quoi ?</span>
                <p>
                    Pour faire court, je suis un passionné de création informatique.
                    J'étends mon savoir-faire dans le but de découvrir des choses,
                    mais surtout de <strong>rendre réel ce que j'imagine</strong>.
                </p>
                <p>
                    Chaque compétence est une porte d'entrée vers d'autres, plus
                    compliquées d'accès. De quoi proposer des choses que tout le monde
                    ne propose pas.
                </p>
            </article>

            {/* Qui suis-je ? */}
            <article className="bento-tile bento-tile--qui">
                <span className="bento-label">Qui suis-je ?</span>
                <p>
                    Un geek dans sa bulle. Depuis tout petit, je crée des mondes :
                    Music 2000, l'éditeur de maps de Far Cry, les command blocks de Minecraft…
                    puis un jour, VSCode.
                </p>
            </article>

            {/* Outils */}
            <article className="bento-tile bento-tile--outils">
                <span className="bento-label">Mes outils</span>
                <div className="bento-marquee" role="img" aria-label={OUTILS.join(", ")}>
                    {marqueeRows.map((row, r) => (
                        <div
                            key={r}
                            className={`bento-marquee__track${r % 2 ? " bento-marquee__track--reverse" : ""}`}
                            style={{ "--duration": `${row.duration}s` }}
                            aria-hidden="true"
                        >
                            {/* Liste doublée pour une boucle sans couture */}
                            {[...row.items, ...row.items].map((o, i) => (
                                <span key={i}>{o}</span>
                            ))}
                        </div>
                    ))}
                </div>
            </article>

            {/* Contact */}
            <article className="bento-tile bento-tile--contact">
                <p className="bento-contact__title">Un projet&nbsp;? Une idée&nbsp;?<br />Ou juste dire coucou&nbsp;?</p>
                <div className="bento-contact__bottom">
                    <Link to="/contact" viewTransition className="bento-contact__cta">
                        Me contacter →
                    </Link>
                    <div className="bento-contact__socials">
                        {SOCIALS.map((s) => (
                            <a key={s.icon} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                                <img src={asset(`/assets/socials/${s.icon}.svg`)} alt="" width="22" height="22" />
                            </a>
                        ))}
                    </div>
                </div>
            </article>
        </section>
    );
}
