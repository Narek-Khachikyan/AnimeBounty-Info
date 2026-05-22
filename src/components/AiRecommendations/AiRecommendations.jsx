import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  buildAiLibraryProfile,
  filterDuplicateRecommendations,
  getAiStatusSummary,
  normalizeHydratedRecommendation,
  requestAiRecommendations,
} from "../../features/aiRecommendations";
import {
  useLazyGetAnimeSearchQuery,
  useLazyGetMangaSearchQuery,
} from "../../features/apiSlice";
import "./aiRecommendations.scss";

const mediaOptions = [
  { label: "Anime + manga", value: "all" },
  { label: "Anime", value: "anime" },
  { label: "Manga", value: "manga" },
];

const initialState = {
  message: "",
  model: "",
  recommendations: [],
  status: "idle",
};

const AiRecommendations = ({ items }) => {
  const [mediaType, setMediaType] = useState("all");
  const [state, setState] = useState(initialState);
  const [getAnimeSearch] = useLazyGetAnimeSearchQuery();
  const [getMangaSearch] = useLazyGetMangaSearchQuery();
  const profile = useMemo(() => buildAiLibraryProfile(items), [items]);
  const summary = useMemo(() => getAiStatusSummary(profile), [profile]);
  const canRecommend = profile.length >= 2;
  const buttonLabel = state.status === "loading" ? "Thinking..." : state.status === "error" ? "Retry" : "Generate picks";

  const hydrateRecommendation = async (recommendation) => {
    const triggerSearch = recommendation.type === "manga" ? getMangaSearch : getAnimeSearch;

    try {
      const searchPayload = await triggerSearch({ query: recommendation.title }).unwrap();
      return normalizeHydratedRecommendation(recommendation, searchPayload);
    } catch {
      return normalizeHydratedRecommendation(recommendation, null);
    }
  };

  const handleGenerate = async () => {
    setState({ ...initialState, status: "loading" });

    try {
      const result = await requestAiRecommendations({ count: 6, items, mediaType });
      const filteredRecommendations = filterDuplicateRecommendations(result.recommendations, items);
      const hydratedRecommendations = await Promise.all(filteredRecommendations.map(hydrateRecommendation));
      const nextStatus = hydratedRecommendations.length > 0 ? "success" : "empty";

      setState({
        message: nextStatus === "empty" ? "No new recommendations were found." : "",
        model: result.model,
        recommendations: hydratedRecommendations,
        status: nextStatus,
      });
    } catch (error) {
      setState({
        message: error.message,
        model: "",
        recommendations: [],
        status: "error",
      });
    }
  };

  return (
    <section className="ai-rec" aria-labelledby="ai-rec-title">
      <div className="ai-rec__header">
        <div>
          <p className="section-kicker">AI helper</p>
          <h2 id="ai-rec-title">Recommendations from your shelf</h2>
        </div>
        <div className="ai-rec__summary" aria-label="Status signals used for recommendations">
          <span>Plan {summary.plan}</span>
          <span>Completed {summary.completed}</span>
          <span>Dropped {summary.dropped}</span>
        </div>
      </div>

      <div className="ai-rec__controls">
        <label>
          <span>Recommend</span>
          <select value={mediaType} onChange={(event) => setMediaType(event.target.value)}>
            {mediaOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <button
          type="button"
          disabled={!canRecommend || state.status === "loading"}
          onClick={handleGenerate}
        >
          {buttonLabel}
        </button>
      </div>

      {!canRecommend ? (
        <div className="ai-rec__notice">
          <p>Save at least two planned, completed, or dropped titles first.</p>
          <Link to="/anime">Browse anime</Link>
          <Link to="/manga">Browse manga</Link>
        </div>
      ) : null}

      {state.status === "error" || state.status === "empty" ? (
        <p className="ai-rec__message" role={state.status === "error" ? "alert" : undefined}>{state.message}</p>
      ) : null}

      {state.recommendations.length > 0 ? (
        <div className="ai-rec__results">
          {state.recommendations.map((item) => (
            <article className="ai-rec-card" key={`${item.type}-${item.title}`}>
              <Link className="ai-rec-card__poster" to={item.route || `/${item.type}?q=${encodeURIComponent(item.title)}`}>
                {item.imageUrl ? <img src={item.imageUrl} alt={item.title} /> : <span>{item.type}</span>}
              </Link>
              <div className="ai-rec-card__body">
                <p className="ai-rec-card__type">{item.type}</p>
                <h3>{item.title}</h3>
                <p>{item.reason}</p>
                <div className="ai-rec-card__meta">
                  {item.score ? <span>Score {item.score}</span> : null}
                  <span>{Math.round(item.confidence * 100)}% match</span>
                </div>
                <Link to={`/${item.type}?q=${encodeURIComponent(item.title)}`}>Search {item.type}</Link>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {state.model ? <p className="ai-rec__model">Generated with {state.model}</p> : null}
    </section>
  );
};

AiRecommendations.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    favorite: PropTypes.bool,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    score: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    status: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["anime", "manga"]).isRequired,
  })).isRequired,
};

export default AiRecommendations;
