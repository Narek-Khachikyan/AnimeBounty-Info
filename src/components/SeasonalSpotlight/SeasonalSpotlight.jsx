import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import AnimeCard from "../AnimeCard/AnimeCard";
import ErrorState from "../ErrorState/ErrorState";
import LazyLoading from "../LazyLoading/LazyLoading";
import {
  useLazyGetSchedulesQuery,
  useLazyGetSeasonNowQuery,
  useLazyGetSeasonUpcomingQuery,
} from "../../features/apiSlice";
import "./seasonalSpotlight.scss";

const tabs = [
  { key: "now", label: "Now" },
  { key: "upcoming", label: "Upcoming" },
  { key: "schedule", label: "Schedule" },
];

const SeasonalGrid = ({ items }) => {
  if (items.length === 0) {
    return <p className="seasonal-spotlight__empty">No seasonal titles are available right now.</p>;
  }

  return (
    <div className="seasonal-spotlight__grid">
      {items.slice(0, 5).map((item) => (
        <Link key={item.mal_id} to={`/anime/${item.mal_id}`}>
          <AnimeCard {...item} />
        </Link>
      ))}
    </div>
  );
};

SeasonalGrid.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const SeasonalSpotlight = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("now");
  const [
    triggerSeasonNow,
    {
      data: seasonNow,
      isLoading: seasonNowLoading,
      isFetching: seasonNowFetching,
      isError: seasonNowError,
    },
  ] = useLazyGetSeasonNowQuery();
  const [
    triggerSeasonUpcoming,
    {
      data: seasonUpcoming,
      isLoading: seasonUpcomingLoading,
      isFetching: seasonUpcomingFetching,
      isError: seasonUpcomingError,
    },
  ] = useLazyGetSeasonUpcomingQuery();
  const [
    triggerSchedules,
    {
      data: schedules,
      isLoading: schedulesLoading,
      isFetching: schedulesFetching,
      isError: schedulesError,
    },
  ] = useLazyGetSchedulesQuery();

  const loadTab = (tabKey, preferCache = true) => {
    if (tabKey === "now") {
      triggerSeasonNow(undefined, preferCache);
    } else if (tabKey === "upcoming") {
      triggerSeasonUpcoming(undefined, preferCache);
    } else {
      triggerSchedules({ filter: "monday" }, preferCache);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    loadTab(activeTab);
  };

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
    loadTab(tabKey);
  };

  const activeState = {
    now: {
      data: seasonNow,
      isLoading: seasonNowLoading,
      isFetching: seasonNowFetching,
      isError: seasonNowError,
      retry: () => triggerSeasonNow(undefined, false),
    },
    upcoming: {
      data: seasonUpcoming,
      isLoading: seasonUpcomingLoading,
      isFetching: seasonUpcomingFetching,
      isError: seasonUpcomingError,
      retry: () => triggerSeasonUpcoming(undefined, false),
    },
    schedule: {
      data: schedules,
      isLoading: schedulesLoading,
      isFetching: schedulesFetching,
      isError: schedulesError,
      retry: () => triggerSchedules({ filter: "monday" }, false),
    },
  }[activeTab];
  const items = Array.isArray(activeState.data?.data) ? activeState.data.data : [];

  return (
    <section className="seasonal-spotlight" aria-labelledby="seasonal-spotlight-title">
      <div className="section-heading">
        <p className="section-kicker">Airing calendar</p>
        <h2 id="seasonal-spotlight-title" className="TopAnime__title">Seasonal spotlight</h2>
      </div>
      <p className="seasonal-spotlight__copy">
        Check what is airing now, what is coming next, and what is scheduled this week without leaving the anime shelf.
      </p>
      {!isOpen ? (
        <button type="button" className="show-btn" onClick={handleOpen}>
          Open seasonal spotlight
        </button>
      ) : (
        <>
          <div className="seasonal-spotlight__tabs" aria-label="Seasonal spotlight views">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={activeTab === tab.key ? "seasonal-spotlight__tab seasonal-spotlight__tab--active" : "seasonal-spotlight__tab"}
                onClick={() => handleTabClick(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {activeState.isLoading || activeState.isFetching ? (
            <LazyLoading message="Loading seasonal anime..." count={5} />
          ) : activeState.isError ? (
            <ErrorState
              message="Seasonal anime could not be loaded."
              onRetry={activeState.retry}
              isRetrying={activeState.isFetching}
            />
          ) : (
            <SeasonalGrid items={items} />
          )}
        </>
      )}
    </section>
  );
};

export default SeasonalSpotlight;
