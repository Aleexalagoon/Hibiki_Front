import { defineStore } from 'pinia';

interface UserData {
  name: string;
  avatar: string | null;
  publicLists: number;
  following: number;
}

interface Artist {
  id: number;
  name: string;
  image: string;
}

interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  image: string;
  duration: string;
  explicit: boolean;
  liked: boolean;
}

interface Playlist {
  id: number;
  title: string;
  image: string;
}



export const useProfileStore = defineStore('profileStore', {
  state: () => ({
    userData: {
      name: '',
      avatar: null,
      publicLists: 0,
      following: 0
    } as UserData,
    topArtists: [] as Artist[],
    topTracks: [] as Track[],
    publicPlaylists: [] as Playlist[],
    loading: true,
    error: null as string | null
  }),


  actions: {
    // Obtener los datos del perfil del usuario
    async fetchUserData(token: string): Promise<void> {
      this.loading = true;
      this.error = null;
      
      try {
        // Obtenemos todos los datos del perfil en una sola llamada
        const response = await fetch('https://localhost:7295/api/perfil', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
    
        if (!response.ok) {
          throw new Error('No se pudo cargar el perfil');
        }
    
        const data = await response.json();
        console.log('Datos recibidos de la API:', data); // Agregar para debug

        
        // Actualizar los datos del usuario con el nombre real del perfil
        this.userData = {
          name: data.nombre || 'Usuario', // Asegurarse de que el nombre se asigna correctamente
          avatar: data.imagen || null, // Asegurarse de que la imagen se asigna correctamente
          publicLists: data.playlistId ? 1 : 0, 
          following: data.siguiendo?.length || 0 // Si hay un campo siguiendo, usarlo
        };
        
        // Transformar ArtistasMasEscuchados a topArtists
        if (data.artistasMasEscuchados && Array.isArray(data.artistasMasEscuchados)) {
          this.topArtists = data.artistasMasEscuchados.map((artista: any) => ({
            id: artista.id || artista.artistaId,
            name: artista.nombre,
            image: artista.imagen
          }));
        } else {
          // Cargar datos demo si no hay artistas
          this.loadDemoArtists();
        }
        
        // Transformar CancionesMasEscuchadas a topTracks
        if (data.cancionesMasEscuchadas && Array.isArray(data.cancionesMasEscuchadas)) {
          this.topTracks = data.cancionesMasEscuchadas.map((cancion: any) => ({
            id: cancion.id || cancion.cancionId,
            title: cancion.titulo,
            artist: cancion.artista?.nombre || 'Artista desconocido',
            album: cancion.album?.nombre || 'Álbum desconocido',
            image: cancion.imagen || cancion.album?.imagen,
            duration: this.formatDuration(cancion.duracion || 0),
            explicit: cancion.explicitFlag || false,
            liked: cancion.liked || false
          }));
        } else {
          // Cargar datos demo si no hay canciones
          this.loadDemoTracks();
        }
        
        // Cargar playlists de demostración por ahora
        this.loadDemoPlaylists();
        
      } catch (err: any) {
        this.error = err.message || 'Error al cargar el perfil';
        console.error('Error al cargar el perfil:', err);
        
        // En caso de error, cargar datos de demostración
        this.loadDemoData();
      } finally {
        this.loading = false;
      }
    },

    // Función auxiliar para formatear la duración en minutos:segundos
    formatDuration(seconds: number): string {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    // Cargar datos de demostración para artistas
    loadDemoArtists(): void {
      this.topArtists = [
        { id: 1, name: "Kidd Keo", image: "https://is1-ssl.mzstatic.com/image/thumb/AMCArtistImages211/v4/65/0e/a2/650ea24f-5401-4e08-ecf7-9081249b04fa/ami-identity-e48b4e37b7a075ce6c8a3de6011fe00c-2025-02-02T22-49-46.871Z_cropped.png/190x190cc.webp" },
        { id: 2, name: "El Alfa", image: "https://is1-ssl.mzstatic.com/image/thumb/AMCArtistImages126/v4/2e/32/6f/2e326fdc-fb27-e00e-475f-a9df3ad9d6d3/7ccdb426-6b40-455c-b92a-f2d497d70b95_file_cropped.png/190x190cc.webp" },
        { id: 3, name: "JC Reyes", image: "https://is1-ssl.mzstatic.com/image/thumb/Features211/v4/fd/9b/d1/fd9bd188-596f-4e72-fa75-c3b1e9614413/mza_8866307029188129263.jpg/190x190cc.webp" },
        { id: 4, name: "J Balvin", image: "https://is1-ssl.mzstatic.com/image/thumb/AMCArtistImages221/v4/a0/82/2e/a0822ef7-bb35-0e8a-26c6-fc17b89cd981/4e221583-bbd6-4b39-a223-ab11ef917eef_ami-identity-2477920ef7d821e53b230e4ca07b3e3e-2024-08-07T23-22-48.742Z_cropped.png/190x190cc.webp" },
        { id: 5, name: "Beny Jr", image: "https://is1-ssl.mzstatic.com/image/thumb/Features126/v4/ac/b3/4f/acb34f94-5439-45e2-4f39-4e96057fb400/mza_16107639031153135449.jpg/305x305SC.FPESS04.webp?l=es-ES" },
        { id: 6, name: "Daddy Yankee", image: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/79/fc/86/79fc86d5-cd9c-1a5f-dec4-f620dc8139e5/24CRGIM46882.rgb.jpg/316x316bb.webp" }
      ];
    },
    
    // Cargar datos de demostración para canciones
    loadDemoTracks(): void {
      this.topTracks = [
        {
          id: 1,
          title: "EGO",
          artist: "Bad Bunny",
          album: "DEBÍ TIRAR MÁS FOTOS",
          image: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/90/5e/7e/905e7ed5-a8fa-a8f3-cd06-0028fdf3afaa/199066342442.jpg/316x316bb.webp",
          duration: "3:24",
          explicit: true,
          liked: true
        },
        {
          id: 2,
          title: "Don't Stop The Music",
          artist: "Rihanna",
          album: "Good Girl Gone Bad",
          image: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/2b/c0/81/2bc081c8-25f0-ba43-d451-587a54613778/16UMGIM59202.rgb.jpg/316x316bb.webp",
          duration: "4:27",
          explicit: false,
          liked: false
        }
      ];
    },
    
    // Cargar datos de demostración para playlists
    loadDemoPlaylists(): void {
      this.publicPlaylists = [
        {
          id: 1,
          title: "XXX",
          image: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/3d/0d/06/3d0d06e6-cfd4-8f69-4a42-52b7cf33fb24/25UMGIM09490.rgb.jpg/88x88bb.jpg"
        },
        {
          id: 2,
          title: "Chill sad",
          image: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/3d/0d/06/3d0d06e6-cfd4-8f69-4a42-52b7cf33fb24/25UMGIM09490.rgb.jpg/88x88bb.jpg"
        }
      ];
    },

    // Cargar datos de demostración completos
    loadDemoData(): void {
      // Datos de demostración para userData
      this.userData = {
        name: 'Usuario Demo',
        avatar: null,
        publicLists: 4,
        following: 12
      };
      
      // Cargar datos de demostración para cada sección
      this.loadDemoArtists();
      this.loadDemoTracks();
      this.loadDemoPlaylists();
    }
  }

  
});