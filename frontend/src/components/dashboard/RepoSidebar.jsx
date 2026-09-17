import "./RepoSidebar.css";

const RepoSidebar = ({ search, setSearch, searchResult }) => {
    return (
        <aside className="repo-sidebar">

            <div className="repo-header">
                <h2>Your Repos</h2>

                <button className="new-repo-btn">
                    <span>▣</span> New
                </button>
            </div>

            <input
                className="repo-search"
                placeholder="Find a repository..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="repo-list">
                {searchResult.map((repo) => (
                    <div
                        className="repo-item"
                        key={repo._id}
                    >
                        <div className="repo-icon">
                            ✚
                        </div>

                        <span className="repo-name">
                            {repo.owner?.username}/{repo.name}
                        </span>
                    </div>
                ))}
            </div>

        </aside>
    );
};

export default RepoSidebar;