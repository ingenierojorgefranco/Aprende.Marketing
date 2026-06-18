import React from "react";
import { User } from "../../../types";
import { OnboardingWizard } from "./OnboardingWizard";

interface WizardDashboardProps {
  user: User;
  onLogout?: () => void;
}

const WizardDashboard: React.FC<WizardDashboardProps> = ({ user, onLogout }) => {
  return (
    <div className="w-full min-h-screen bg-[#020202] text-white">
      <OnboardingWizard
        user={user}
        onComplete={() => {}}
        onLogout={onLogout}
        isStandaloneDashboard={true}
      />
    </div>
  );
};

export default WizardDashboard;
