import "./Changelog.css";

const Changelog = () => {
    return (
        <div className="changelog">
            <h3>Latest from our changelog</h3>

            <div className="timeline">

                <div className="timeline-item">
                    <span className="dot"></span>
                    <div>
                        <p className="date">2 days ago</p>
                        <p className="title">
                            GitHub Copilot in Visual Studio — August update
                        </p>
                    </div>
                </div>

                <div className="timeline-item">
                    <span className="dot"></span>
                    <div>
                        <p className="date">2 days ago</p>
                        <p className="title">
                            GitHub Copilot weekly releases — August 24
                        </p>
                    </div>
                </div>

                <div className="timeline-item">
                    <span className="dot"></span>
                    <div>
                        <p className="date">2 days ago</p>
                        <p className="title">
                            Upcoming changes to GitHub Copilot policies and billing
                        </p>
                    </div>
                </div>

                <div className="timeline-item">
                    <span className="dot"></span>
                    <div>
                        <p className="date">2 days ago</p>
                        <p className="title">
                            Better label management on issues is generally available
                        </p>
                    </div>
                </div>

            </div>

            <a href="#" className="changelog-link">
                View changelog →
            </a>
        </div>
    );
};

export default Changelog;