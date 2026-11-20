import Img from "../components/Img";

export default function BlogPub() {
    return (
        <section className="blog-pub">
            <div className="blog-pub_img">
                <Img src="/assets/blog_pub.png" alt="" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
        </section>
    );
}