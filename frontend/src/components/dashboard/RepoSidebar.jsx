import "./RepoSidebar.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const RepoSidebar = ({ search, setSearch, searchResult }) => {
    const navigate = useNavigate();
    return (
        <aside className="repo-sidebar">

            <div className="repo-header">
                <h2>Your Repos</h2>

                <button className="new-repo-btn" onClick={() => navigate("/repo/create")}>
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

                        <Link
                            to={`/files/${repo._id}`}
                            className="repo-name"
                        >
                            {repo.owner?.username}/{repo.name}
                        </Link>
                    </div>
                ))}
            </div>

        </aside>
    );
};

export default RepoSidebar;