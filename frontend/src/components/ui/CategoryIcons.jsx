import { 
  Utensils, 
  Mountain, 
  Trophy, 
  PartyPopper, 
  Music, 
  Plane, 
  BookOpen, 
  Languages, 
  MoreHorizontal 
} from 'lucide-react';

const CategoryIcons = ({ category, className = "w-5 h-5" }) => {
  const icons = {
    tapeo: <Utensils className={className} />,
    senderismo: <Mountain className={className} />,
    deporte: <Trophy className={className} />,
    fiesta: <PartyPopper className={className} />,
    musica: <Music className={className} />,
    viajes: <Plane className={className} />,
    cultura: <BookOpen className={className} />,
    idiomas: <Languages className={className} />,
    other: <MoreHorizontal className={className} />
  };

  return icons[category] || icons.other;
};

export default CategoryIcons;
