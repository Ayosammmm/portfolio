import '../scss/404.scss'

export default function NoPage() {
    return (
        <section className="no-page">
            <div className="no-page__content">
                <h1>Page non trouvée</h1>
                <p>La page que vous cherchez n'existe pas.</p>
            </div>
        </section>
    );
}