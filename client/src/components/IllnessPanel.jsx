const IllnessPanel = ({ illnesses = [], title = "Previous Illnesses" }) => {
    const validIllnesses = illnesses.filter(
        (illness) => illness && illness.trim().length > 0
    );

    return (
        <div className="illness-panel">
            <div className="illness-panel-header">
                <div className="illness-icon">+</div>
                <div>
                    <h3>{title}</h3>
                    <p>Your recorded medical history</p>
                </div>
            </div>

            {validIllnesses.length > 0 ? (
                <div className="illness-tags">
                    {validIllnesses.map((illness, index) => (
                        <span className="illness-tag" key={`${illness}-${index}`}>
                            {illness}
                        </span>
                    ))}
                </div>
            ) : (
                <div className="no-illness">No previous illnesses recorded.</div>
            )}
        </div>
    );
};

export default IllnessPanel;