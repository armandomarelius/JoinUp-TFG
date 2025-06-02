const UserAvatar = ({ user, size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-lg", 
    lg: "w-14 h-14 text-xl",
    xl: "w-32 h-32 text-4xl"
  };

  const baseClasses = `${sizeClasses[size]} rounded-full flex items-center justify-center font-bold ${className}`;

  if (user?.avatar?.url) {
    return (
      <img
        src={user.avatar.url}
        alt={`Avatar de ${user.username}`}
        className={`${baseClasses} object-cover`}
      />
    );
  }

  return (
    <div className={`${baseClasses} bg-sky-100 text-sky-700`}>
      {user?.username?.charAt(0).toUpperCase() || 'U'}
    </div>
  );
};

export default UserAvatar; 