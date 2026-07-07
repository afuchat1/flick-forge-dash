import { Link, useLocation } from "react-router-dom";

const CategoryTabs = () => {
  const location = useLocation();

  const tabs = [
    { name: "Trending", href: "/" },
    { name: "Movies", href: "/movies" },
    { name: "TV", href: "/tv-shows" },
    { name: "New", href: "/new-popular" },
    { name: "My List", href: "/my-list" },
  ];

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-4 px-3 py-2 whitespace-nowrap">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.href;
          return (
            <Link
              key={tab.name}
              to={tab.href}
              className={`text-sm font-semibold transition-colors ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTabs;
