const ConsultationStepper = ({ currentStep, onStepClick }) => {
    const steps = [
        { number: 1, title: "Health Details", description: "Current condition" },
        { number: 2, title: "Medical History", description: "Additional information" },
        { number: 3, title: "Payment", description: "Transaction details" }
    ];

    return (
        <div className="consultation-stepper">
            {steps.map((step, index) => {
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;

                const stepClasses = [
                    "step-item",
                    isActive ? "active" : "",
                    isCompleted ? "completed" : ""
                ].filter(Boolean).join(" ");

                return (
                    <div className="step-wrapper" key={step.number}>
                        <button
                            type="button"
                            className={stepClasses}
                            onClick={() => {
                                if (isCompleted) {
                                    onStepClick?.(step.number);
                                }
                            }}
                        >
                            <div className="step-number">
                                {isCompleted ? "✓" : step.number}
                            </div>
                            <div className="step-content">
                                <strong>{step.title}</strong>
                                <span>{step.description}</span>
                            </div>
                        </button>

                        {index < steps.length - 1 && (
                            <div className={`step-line ${isCompleted ? "completed" : ""}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ConsultationStepper;