import { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import Folder from '../components/Folder';
import Img from '../components/Img';
import projects from "../data/projects";
import Lenis from 'lenis';

import '../scss/Creations.scss';

export default function Creations() {
    const [selectedTag, setSelectedTag] = useState("all");
    const [hoveredProject, setHoveredProject] = useState(null);
    const rightSideRef = useRef(null);

    const tags = ["all", "son", "vidéo", "dev", "infographie", "3d"];

    const filteredProjects = selectedTag === "all"
        ? projects
        : projects.filter(project =>
            Array.isArray(project.tags) && project.tags.includes(selectedTag)
        );

    useEffect(() => {
        if (!rightSideRef.current) return;

        // Instanciation de Lenis sur l’élément right-side
        const lenis = new Lenis({
            wrapper: rightSideRef.current,   // le conteneur scrollable
            content: rightSideRef.current.querySelector('.projects-grid'), // le contenu à scroller
            smoothWheel: true,
            smoothTouch: true
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <section className="creations-page">
            <div className='left-side section-in'>
                <div className='main-infos'>
                    <h1 className='shiny-text' shinylayer="Mes Créations">Mes Créations</h1>

                    <div className="creation-preview">
                        {hoveredProject ? (
                            <>
                                <div className='creation-preview-head'>
                                    <div className="creation-img">
                                        <Img src={hoveredProject.cover} alt={hoveredProject.title} sizes="200px" />
                                    </div>
                                    <div className="creation-tag">
                                        {hoveredProject.tags.map((tag, idx) => (
                                            <span key={idx} className={`tag ${tag}`}>{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="creation-preview-content">
                                    <h2 className="creation-titre">{hoveredProject.title}</h2>
                                    <div className="creation-soustitre">{hoveredProject.subtitle}</div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='creation-preview-head'>
                                    <div className="creation-img">
                                    </div>
                                </div>
                                <div className="creation-preview-content">
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="left-bottom">
                    <div className="tag-selector">
                        <h2 className='shiny-text' shinylayer="Filtrer">Filtrer</h2>
                        <div className="tags">
                            {tags.map(tag => (
                                <button
                                    key={tag}
                                    className={`tag tag-button ${selectedTag === tag ? "active" : ""}`}
                                    onClick={() => setSelectedTag(tag)}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className='right-side' ref={rightSideRef}>
                <div className="projects-grid section-in-stagger" style={{ "--section-in-step": "0.10s", "--section-in-delay": "0s" }}>
                    {filteredProjects.map((project) => {
                        const items = project.gallery.slice(0, 3).map((image, index) => (
                            <Img key={index} src={image.url} alt={`Image ${index + 1}`} sizes="(max-width: 768px) 50vw, 20vw" loading="lazy" />
                        ));
                        const cover = (
                            <Img src={project.cover} alt={`Dossier ${project.title}`} sizes="(max-width: 768px) 50vw, 20vw" loading="lazy" />
                        );

                        return (
                            <Link
                                viewTransition
                                key={project.slug}
                                to={`/creations/${project.slug}`}
                                onMouseEnter={() => setHoveredProject(project)}
                                onMouseLeave={() => setHoveredProject(null)}>
                                <div style={{ position: 'relative' }}>
                                    <Folder
                                        size={1}
                                        color={project.color || "#000"}
                                        className="custom-folder"
                                        items={items}
                                        cover={cover}
                                    />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
