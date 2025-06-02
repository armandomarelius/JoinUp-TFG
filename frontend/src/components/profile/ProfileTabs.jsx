import { User, Calendar, Users, Inbox, Heart } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const ProfileTabs = ({ activeTab, onTabChange }) => {
  const { pendingRequestsCount } = useNotifications();
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: User },
    { id: 'my-events', label: 'Mis Eventos', icon: Calendar },
    { id: 'participating', label: 'Participando', icon: Users },
    { id: 'requests', label: 'Solicitudes', icon: Inbox, badge: pendingRequestsCount },
    { id: 'favorites', label: 'Favoritos', icon: Heart },
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-8 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors relative ${
                activeTab === tab.id
                  ? 'border-sky-500 text-sky-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                  {tab.badge > 99 ? '99+' : tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default ProfileTabs; 