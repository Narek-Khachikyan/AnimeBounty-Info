import "./About.scss";

const About = () => {
  return (
    <main className="about-page">
      <section className="about-hero">
        <p className="section-kicker">About AnimeBounty-Info</p>
        <h1>A quieter way to browse anime and manga.</h1>
        <p>
          AnimeBounty-Info keeps the poster art up front, trims the noise, and gives fans a faster path from a familiar title to the next shelf worth opening.
        </p>
      </section>

      <section className="about-stats" aria-label="Catalogue highlights">
        <div className="about-stat">
          <strong>Anime</strong>
          <span>Ranked series and films</span>
        </div>
        <div className="about-stat">
          <strong>Manga</strong>
          <span>Titles, chapters, and authors</span>
        </div>
        <div className="about-stat">
          <strong>Ratings</strong>
          <span>Audience fit at a glance</span>
        </div>
        <div className="about-stat">
          <strong>Recs</strong>
          <span>Adjacent picks from Jikan</span>
        </div>
      </section>

      <section className="about-values" aria-label="What makes the app useful">
        <article className="about-card">
          <h2>Poster-led browsing</h2>
          <p>Cards prioritize artwork, scores, and essential metadata so you can scan quickly without losing context.</p>
        </article>
        <article className="about-card">
          <h2>Fast filtering</h2>
          <p>Search by title, sort by popularity or score, and narrow anime by rating without digging through dense menus.</p>
        </article>
        <article className="about-card">
          <h2>Discovery flow</h2>
          <p>Top lists and recommendations make it easy to jump from a familiar title into something new.</p>
        </article>
      </section>

      <section className="about-actions">
        <h2>What you can do</h2>
        <ul>
          <li>Search anime and manga catalogues with debounced inputs.</li>
          <li>Compare titles by score, popularity, title, and direction.</li>
          <li>Open detail pages for deeper title information.</li>
          <li>Browse recommendation sections for adjacent picks.</li>
        </ul>
      </section>
    </main>
  )
}

export default About
