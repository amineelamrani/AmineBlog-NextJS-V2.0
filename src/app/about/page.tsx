export const metadata = {
  title: "About Page | Amine's Code Chronicles",
};

export default function About() {
  return (
    <div className="container py-24 px-5 md:px-24 lg:px-52 w-full mx-auto flex flex-col items-center gap-5">
      <h1 className="text-2xl md:text-3xl lg:text-4xl md:pb-10 text-center font-bold capitalize">
        About Amine&lsquo;s Code Chronicles Blog
      </h1>
      <p>
        Hi, I&lsquo;m <span className="font-bold">Amine ELAMRANI</span>, a
        passionate <span className="font-bold">Full Stack Developer</span> with
        a love for turning ideas into reality through code. Welcome to my corner
        of the internet! This blog is more than just a personal
        project—it&lsquo;s a space where I share my journey, thoughts, and the
        occasional quirky problem-solving adventures.
      </p>
      <p>
        I&lsquo;ve always been fascinated by how a few lines of code can solve
        real-world problems or even create entirely new possibilities. Whether
        it&lsquo;s building something practical or diving into imaginative
        projects that don&lsquo;t yet exist, I&lsquo;m all about exploring the
        endless potential of technology.
      </p>
      <p>
        But this blog isn&lsquo;t just about me—it&lsquo;s about{" "}
        <span className="font-bold">us</span>. I created this platform to
        connect with like-minded individuals who are curious, creative, and
        eager to learn. Here, you&lsquo;ll find a mix of technical insights,
        personal reflections, and maybe even a few challenges to spark your own
        creativity.
      </p>
      <p>
        I believe in the power of community, and I&lsquo;d love for you to be a
        part of it. Whether you&lsquo;re here to learn, share, or simply geek
        out over code, your voice matters. Feel free to leave comments, engage
        with other readers, and let&lsquo;s grow together.
      </p>
      <p>
        So, grab a coffee, get comfortable, and let&lsquo;s embark on this
        journey of discovery, innovation, and connection. Thanks for stopping
        by—I&lsquo;m excited to have you here!
      </p>
      <p>
        <span className="text-lg">🚀</span>{" "}
        <em>
          P.S. If you ever want to chat about coding, creativity, or just life
          in general, don&lsquo;t hesitate to reach out. Let&lsquo;s build
          something amazing together!
        </em>{" "}
        <span className="text-lg">😊</span>
      </p>
    </div>
  );
}
