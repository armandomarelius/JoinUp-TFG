import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile } from '../../services/fetchService';

const UserProfileSection = () => {
  const { user, checkAuthStatus } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Estados para el formulario
  const [aboutMe, setAboutMe] = useState(user?.about_me || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setError('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen debe ser menor a 5MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const profileData = {
        about_me: aboutMe
      };
      
      if (selectedFile) {
        profileData.avatar = selectedFile;
      }

      await updateUserProfile(profileData);
      
      // Actualizar el contexto de autenticación
      await checkAuthStatus();
      
      setSuccess(true);
      setIsEditing(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAboutMe(user?.about_me || '');
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
  };

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-8 text-gray-500">
          Cargando información del perfil...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-sky-700 mb-2">Mi Perfil</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
          >
             Editar Perfil
          </button>
        )}
      </div>

      {/* Mensajes de estado */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm">
          ¡Perfil actualizado exitosamente!
        </div>
      )}

      {!isEditing ? (
        // Vista de solo lectura - Optimizada para columna
        <div className="space-y-6">
          {/* Avatar centrado */}
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-sky-100 flex items-center justify-center shadow-lg">
              {user.avatar?.url ? (
                <img
                  src={user.avatar.url}
                  alt={`Avatar de ${user.username}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl text-sky-600 font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Información del usuario */}
          <div className="space-y-4 text-center">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Usuario
              </label>
              <p className="text-xl font-bold text-gray-900">{user.username}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Email
              </label>
              <p className="text-base text-gray-600 font-medium">{user.email}</p>
            </div>
            
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Acerca de mí
              </label>
              <p className="text-gray-700 leading-relaxed text-sm">
                {user.about_me || 'No has añadido información sobre ti aún.'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Formulario de edición - Optimizado para columna
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sección de avatar */}
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Foto de perfil
            </label>
            
            <div className="flex justify-center mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-sky-100 flex items-center justify-center shadow-lg">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : user.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt={`Avatar de ${user.username}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl text-sky-600 font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
            />
            <p className="text-xs text-gray-500 mt-2">
              JPG, PNG. Máximo 5MB.
            </p>
          </div>

          {/* Información del usuario */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de usuario
              </label>
              <div className="text-lg font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg text-center">
                {user.username}
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                El nombre de usuario no se puede cambiar
              </p>
            </div>
            
            <div>
              <label htmlFor="about_me" className="block text-sm font-medium text-gray-700 mb-2">
                Acerca de mí
              </label>
              <textarea
                id="about_me"
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
                rows={4}
                maxLength={500}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none text-sm"
                placeholder="Cuéntanos algo sobre ti..."
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {aboutMe.length}/500 caracteres
              </p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col gap-2 pt-4 border-t">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Guardando...' : ' Guardar Cambios'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="w-full bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
               Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserProfileSection;
