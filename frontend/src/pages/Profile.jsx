import { useState } from "react";
import { useLocation } from "react-router-dom";
import MyEventsSection from "../components/profile/MyEventsSection";
import ParticipatingEventsSection from "../components/profile/ParticipatingEventsSection";
import UserProfileSection from "../components/profile/UserProfileSection";
import UpcomingEventsSection from "../components/profile/UpcomingEventsSection";
import EventCalendar from "../components/profile/EventCalendar";
import ProfileTabs from "../components/profile/ProfileTabs";
import FavoritesSection from "../components/profile/FavoritesSection";
import RequestsSection from "../components/profile/RequestsSection";

const Profile = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'dashboard');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EventCalendar />
              <UpcomingEventsSection />
            </div>
          </div>
        );
      
      case 'my-events':
        return <MyEventsSection />;
      
      case 'participating':
        return <ParticipatingEventsSection />;
      
      case 'requests':
        return <RequestsSection />;
      
      case 'favorites':
        return <FavoritesSection />;
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Perfil del usuario */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <UserProfileSection />
          </div>
        </div>

        {/* Contenido principal */}
        <div className="lg:col-span-3">
          <ProfileTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
          />
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;