import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Masonry from '../components/Masonry';

import { Link } from "react-router-dom";

import '../scss/Project.scss';

const Project = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    import(`../data/${slug}.json`)
      .then((mod) => setProject(mod))
      .catch(() => setProject(null));
  }, [slug]);

  if (!project) return <p>Projet introuvable...</p>;

  const galeryItems = project.gallery;
  console.log(galeryItems);

  return (
    <>
      <section className="project-head"
        style={{ "--bg": `url('${project.bg}')` }}>
        <div className="container">
          <h2>{project.subtitle}</h2>
          <h1>{project.title}</h1>
          <img src={project.hero} alt={project.title} className="main-image" />
        </div>
      </section>
      <section className="project-body">
        <div className="texte-large-section">
          <div className="container">
            <p className="project-desc frame-simple">
              {project.description}
            </p>
          </div>
        </div>
        {project.iframes && (
          <div className="container grid-videos">
            {project.iframes.map((iframe, index) => (
              <iframe key={index} scrolling="no" width="576" height="324" loading="lazy" title={iframe.title}
                src={iframe.url}
                frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
            ))}
          </div>
        )}
        <div className="container bento-box">
          {galeryItems.map((image, index) => (
            <div className="bento-item"
              style={{ "--grid-width": image.width, "--grid-height": image.height }}>
              <div className="img-hover">
                <img key={index} width="576" height="324" loading="lazy" title={image.title}
                  src={image.url} />
              </div>
            </div>
          ))}
          {project.videos && (
            <>
              {project.videos.map((video, index) => (
                <div className="bento-item"
                  style={{ "--grid-width": video.width, "--grid-height": video.height }}>
                  <div className="video-el">
                    <video
                      width="250"
                      autoPlay={video.auto}
                      loop={video.auto}
                      muted={video.auto}
                      controls={!video.auto}
                    >
                      <source src={video.url} type="video/mp4" />
                    </video >
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        <div className="back-to-creations">
          <Link to="/creations" className="btn btn-primary" viewTransition>
            Retour aux créations
          </Link>
        </div>
      </section >
    </>
  );
};

export default Project;
