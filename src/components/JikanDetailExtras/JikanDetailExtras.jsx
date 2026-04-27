import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import ErrorState from "../ErrorState/ErrorState";
import LazyLoading from "../LazyLoading/LazyLoading";
import "./jikanDetailExtras.scss";

const relationPriority = [
  "Prequel",
  "Sequel",
  "Spin-off",
  "Side story",
  "Adaptation",
  "Alternative version",
  "Alternative setting",
  "Parent story",
  "Summary",
  "Character",
  "Other",
];

const getRelationRank = (relation) => {
  const index = relationPriority.findIndex((item) => item.toLowerCase() === relation?.toLowerCase());

  return index === -1 ? relationPriority.length : index;
};

export const RelationsPanel = ({ isActive, isError, isFetching, isLoading, items, onOpen, onRetry }) => {
  const relationItems = Array.isArray(items)
    ? [...items].sort((first, second) => getRelationRank(first.relation) - getRelationRank(second.relation))
    : [];

  return (
    <section className="detail-extra" aria-labelledby="relations-title">
      <div className="detail-extra__header">
        <div>
          <p className="section-kicker">Story map</p>
          <h2 id="relations-title" className="detail-section__title">Relations</h2>
        </div>
        {!isActive ? (
          <button type="button" className="show-btn" onClick={onOpen}>
            Explore relations
          </button>
        ) : null}
      </div>
      {isActive ? (
        isLoading || isFetching ? (
          <LazyLoading message="Loading relations..." count={4} />
        ) : isError ? (
          <ErrorState message="Relations could not be loaded." onRetry={onRetry} isRetrying={isFetching} />
        ) : relationItems.length > 0 ? (
          <div className="detail-extra__relation-chain" aria-label="Franchise chain">
            <p className="detail-extra__chain-label">Franchise chain</p>
            {relationItems.map((relation) => {
              const entries = Array.isArray(relation.entry) ? relation.entry : [];

              return (
                <article key={relation.relation} className="detail-extra__relation-step">
                  <div className="detail-extra__relation-marker" aria-hidden="true" />
                  <div className="detail-extra__relation-card">
                    <h3>{relation.relation || "Related"}</h3>
                    <div className="detail-extra__links">
                      {entries.map((entry) => {
                        const isInternal = entry.type === "anime" || entry.type === "manga";
                        const target = isInternal ? `/${entry.type}/${entry.mal_id}` : entry.url;

                        return isInternal ? (
                          <Link key={`${entry.type}-${entry.mal_id}-${entry.name}`} to={target}>
                            {entry.name || "Untitled relation"}
                          </Link>
                        ) : (
                          <a key={`${entry.type}-${entry.mal_id}-${entry.name}`} href={target} target="_blank" rel="noreferrer">
                            {entry.name || "Untitled relation"}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="detail-empty">No relations are listed yet.</p>
        )
      ) : null}
    </section>
  );
};

export const StreamingPanel = ({ isActive, isError, isFetching, isLoading, items, onOpen, onRetry }) => {
  const streamingItems = Array.isArray(items) ? items : [];

  return (
    <section className="detail-extra" aria-labelledby="streaming-title">
      <div className="detail-extra__header">
        <div>
          <p className="section-kicker">Where to watch</p>
          <h2 id="streaming-title" className="detail-section__title">Streaming</h2>
        </div>
        {!isActive ? (
          <button type="button" className="show-btn" onClick={onOpen}>
            Find streams
          </button>
        ) : null}
      </div>
      {isActive ? (
        isLoading || isFetching ? (
          <LazyLoading message="Loading streaming providers..." count={3} />
        ) : isError ? (
          <ErrorState message="Streaming links could not be loaded." onRetry={onRetry} isRetrying={isFetching} />
        ) : streamingItems.length > 0 ? (
          <div className="detail-extra__pill-grid">
            {streamingItems.map((item) => (
              <a key={`${item.name}-${item.url}`} href={item.url} target="_blank" rel="noreferrer">
                {item.name || "Streaming provider"}
              </a>
            ))}
          </div>
        ) : (
          <p className="detail-empty">No streaming providers are listed yet.</p>
        )
      ) : null}
    </section>
  );
};

export const VideosPanel = ({ isActive, isError, isFetching, isLoading, items, onOpen, onRetry }) => {
  const videoItems = Array.isArray(items?.promo) ? items.promo : [];

  return (
    <section className="detail-extra" aria-labelledby="videos-title">
      <div className="detail-extra__header">
        <div>
          <p className="section-kicker">Official media</p>
          <h2 id="videos-title" className="detail-section__title">Videos</h2>
        </div>
        {!isActive ? (
          <button type="button" className="show-btn" onClick={onOpen}>
            Watch videos
          </button>
        ) : null}
      </div>
      {isActive ? (
        isLoading || isFetching ? (
          <LazyLoading message="Loading videos..." count={3} />
        ) : isError ? (
          <ErrorState message="Videos could not be loaded." onRetry={onRetry} isRetrying={isFetching} />
        ) : videoItems.length > 0 ? (
          <div className="detail-extra__video-grid">
            {videoItems.map((item) => {
              const title = item.title || "Anime video";
              const imageUrl = item.trailer?.images?.image_url;
              const url = item.trailer?.url;

              return url ? (
                <a key={`${title}-${url}`} href={url} target="_blank" rel="noreferrer" className="detail-extra__video-card">
                  {imageUrl ? <img src={imageUrl} alt="" /> : null}
                  <span>{title}</span>
                </a>
              ) : null;
            })}
          </div>
        ) : (
          <p className="detail-empty">No official videos are listed yet.</p>
        )
      ) : null}
    </section>
  );
};

export const CharacterProfilePanel = ({ characterName, data, isError, isFetching, isLoading, onRetry }) => {
  const character = data?.data;

  if (!characterName) {
    return null;
  }

  return (
    <aside className="character-profile" aria-live="polite">
      {isLoading || isFetching ? (
        <LazyLoading message="Loading character profile..." count={2} />
      ) : isError ? (
        <ErrorState message="Character profile could not be loaded." onRetry={onRetry} isRetrying={isFetching} />
      ) : character ? (
        <>
          <div className="character-profile__media">
            {character.images?.webp?.image_url ? <img src={character.images.webp.image_url} alt={character.name || characterName} /> : null}
          </div>
          <div className="character-profile__body">
            <p className="section-kicker">Character profile</p>
            <h2>{character.name || characterName}</h2>
            {character.name_kanji ? <p className="character-profile__kanji">{character.name_kanji}</p> : null}
            <p className="character-profile__meta">Favorites: <b>{character.favorites ?? "Unknown"}</b></p>
            <p className="character-profile__about">{character.about || "No character biography is available yet."}</p>
          </div>
        </>
      ) : (
        <p className="detail-empty">Character profile is empty.</p>
      )}
    </aside>
  );
};

const queryStatePropTypes = {
  isActive: PropTypes.bool.isRequired,
  isError: PropTypes.bool,
  isFetching: PropTypes.bool,
  isLoading: PropTypes.bool,
  onOpen: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
};

RelationsPanel.propTypes = {
  ...queryStatePropTypes,
  items: PropTypes.arrayOf(PropTypes.object),
};

StreamingPanel.propTypes = {
  ...queryStatePropTypes,
  items: PropTypes.arrayOf(PropTypes.object),
};

VideosPanel.propTypes = {
  ...queryStatePropTypes,
  items: PropTypes.shape({
    promo: PropTypes.arrayOf(PropTypes.object),
  }),
};

CharacterProfilePanel.propTypes = {
  characterName: PropTypes.string,
  data: PropTypes.shape({
    data: PropTypes.object,
  }),
  isError: PropTypes.bool,
  isFetching: PropTypes.bool,
  isLoading: PropTypes.bool,
  onRetry: PropTypes.func.isRequired,
};
