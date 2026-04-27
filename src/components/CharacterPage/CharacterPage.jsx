import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import ErrorState from "../ErrorState/ErrorState";
import LazyLoading from "../LazyLoading/LazyLoading";
import { useGetCharacterFullQuery } from "../../features/apiSlice";
import "./CharacterPage.scss";

const getImageUrl = (item) => (
  item?.images?.webp?.large_image_url ||
  item?.images?.webp?.image_url ||
  item?.images?.jpg?.large_image_url ||
  item?.images?.jpg?.image_url
);

const getInternalTarget = (type, item) => {
  if (!item?.mal_id) {
    return null;
  }

  return `/${type}/${item.mal_id}`;
};

const AppearanceCard = ({ appearance, type }) => {
  const item = appearance?.[type] ?? {};
  const title = item.title || `Untitled ${type}`;
  const imageUrl = getImageUrl(item);
  const internalTarget = getInternalTarget(type, item);
  const className = "character-page__appearance-card";
  const content = (
    <>
      <div className="character-page__appearance-media">
        {imageUrl ? <img src={imageUrl} alt="" /> : <span>{type}</span>}
      </div>
      <div className="character-page__appearance-copy">
        <span>{appearance?.role || "Role unknown"}</span>
        <strong>{title}</strong>
      </div>
    </>
  );

  return internalTarget ? (
    <Link className={className} to={internalTarget}>
      {content}
    </Link>
  ) : (
    <a className={className} href={item.url || "#"} target="_blank" rel="noreferrer">
      {content}
    </a>
  );
};

const AppearanceSection = ({ items, title, emptyMessage, type }) => {
  const appearances = Array.isArray(items) ? items : [];

  return (
    <section className="character-page__section" aria-labelledby={`${type}-appearances-title`}>
      <div className="character-page__section-header">
        <p className="section-kicker">{type}ography</p>
        <h2 id={`${type}-appearances-title`} className="detail-section__title">{title}</h2>
      </div>
      {appearances.length > 0 ? (
        <div className="character-page__appearance-grid">
          {appearances.map((appearance) => {
            const item = appearance?.[type] ?? {};
            const key = `${type}-${item.mal_id || item.title || appearance?.role}`;

            return <AppearanceCard key={key} appearance={appearance} type={type} />;
          })}
        </div>
      ) : (
        <p className="detail-empty">{emptyMessage}</p>
      )}
    </section>
  );
};

const CharacterPage = () => {
  const { id } = useParams();
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetCharacterFullQuery(id);
  const character = data?.data;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <main className="character-page">
        <div className="container">
          <LazyLoading message="Loading character profile..." count={6} />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="character-page">
        <div className="container">
          <ErrorState
            message="Character profile could not be loaded."
            onRetry={refetch}
            isRetrying={isFetching}
          />
        </div>
      </main>
    );
  }

  if (!character) {
    return (
      <main className="character-page">
        <div className="container">
          <ErrorState message="Character profile is empty." />
        </div>
      </main>
    );
  }

  const characterName = character.name || "Unknown character";
  const characterImageUrl = getImageUrl(character);
  const nicknames = Array.isArray(character.nicknames) ? character.nicknames : [];

  return (
    <main className="character-page">
      <div className="container">
        <section className="character-page__hero">
          <div className="character-page__portrait">
            {characterImageUrl ? <img src={characterImageUrl} alt={characterName} /> : <span>No image</span>}
          </div>
          <div className="character-page__intro">
            <p className="section-kicker">Character profile</p>
            <h1>{characterName}</h1>
            {character.name_kanji ? <p className="character-page__kanji">{character.name_kanji}</p> : null}
            <div className="character-page__meta">
              <span>Favorites</span>
              <strong>{character.favorites ?? "Unknown"}</strong>
            </div>
            {nicknames.length > 0 ? (
              <div className="character-page__nicknames">
                {nicknames.slice(0, 4).map((nickname) => (
                  <span key={nickname}>{nickname}</span>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <section className="character-page__section" aria-labelledby="character-biography-title">
          <div className="character-page__section-header">
            <p className="section-kicker">Biography</p>
            <h2 id="character-biography-title" className="detail-section__title">About</h2>
          </div>
          <p className="character-page__biography">
            {character.about || "No character biography is available yet."}
          </p>
        </section>

        <AppearanceSection
          emptyMessage="No anime appearances are listed yet."
          items={character.anime}
          title="Anime appearances"
          type="anime"
        />
        <AppearanceSection
          emptyMessage="No manga appearances are listed yet."
          items={character.manga}
          title="Manga appearances"
          type="manga"
        />
      </div>
    </main>
  );
};

AppearanceCard.propTypes = {
  appearance: PropTypes.object,
  type: PropTypes.oneOf(["anime", "manga"]).isRequired,
};

AppearanceSection.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
  emptyMessage: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["anime", "manga"]).isRequired,
};

export default CharacterPage;
