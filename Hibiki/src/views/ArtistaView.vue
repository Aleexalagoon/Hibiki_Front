<template>
  <div class="artist-page">
    <div class="header">
      <img class="background-image" src="https://i0.wp.com/urbanroosters.news/wp-content/uploads/2023/08/mora.png?fit=1250%2C550&ssl=1" alt="Artist Background" />
      <div class="artist-info">
        <p class="verified">✔ Artista verificado</p>
        <h1 class="artist-name">Mora</h1>
        <p class="monthly-listeners">18,754,747 oyentes mensuales</p>
      </div>
    </div>
    <div class="popular-tracks">
      <h2>Populares</h2>
      <div class="track" v-for="(track, index) in tracks" :key="index">
        <span class="track-number">{{ index + 1 }}</span>
        <img class="track-image" :src="track.image" alt="Track Cover" />
        <span class="track-title">{{ track.title }}</span>
        <span class="track-plays">{{ track.plays }}</span>
        <span class="track-duration">{{ track.duration }}</span>
      </div>
    </div>
    <div class="discography">
      <h2>Discografía</h2>
      <div class="albums">
        <div class="album" v-for="(album, index) in albums" :key="index">
          <img class="album-cover" :src="album.cover" alt="Album Cover" />
          <p class="album-title">{{ album.title }}</p>
          <p class="album-year">{{ album.year }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tracks: [
        { title: "IA", plays: "74,763,704", duration: "4:00", image: "https://i.scdn.co/image/ab67616d0000b273851222dc5c5681bd4c3119d3" },
        { title: "LA INOCENTE", plays: "888,209,406", duration: "3:22", image: "https://i.scdn.co/image/ab67616d0000b273851222dc5c5681bd4c3119d3" },
        { title: "Tuyo", plays: "150,017,142", duration: "4:29", image: "https://i.scdn.co/image/ab67616d0000b273851222dc5c5681bd4c3119d3" },
        { title: "Una Vez", plays: "632,481,996", duration: "3:52", image: "https://i.scdn.co/image/ab67616d0000b273851222dc5c5681bd4c3119d3" },
        { title: "Volando - Remix", plays: "763,480,150", duration: "4:33", image: "https://i.scdn.co/image/ab67616d0000b273851222dc5c5681bd4c3119d3" }
      ],
      albums: [
        { title: "MICRODOSIS", year: "2022 - Álbum", cover: "https://i.scdn.co/image/ab67616d0000b273851222dc5c5681bd4c3119d3" },
        { title: "Primer Día de Clases", year: "2022 - Álbum", cover: "https://i.scdn.co/image/ab67616d0000b273851222dc5c5681bd4c3119d3" },
        { title: "ESTRELLA", year: "2023 - Álbum", cover: "https://i.scdn.co/image/ab67616d0000b273851222dc5c5681bd4c3119d3" },
        { title: "PARAÍSO", year: "2022 - Álbum", cover: "https://i.scdn.co/image/ab67616d0000b273851222dc5c5681bd4c3119d3" },
        { title: "PARAÍSO", year: "2022 - Álbum", cover: "https://i.scdn.co/image/ab67616d0000b273851222dc5c5681bd4c3119d3" },
        { title: "PARAÍSO", year: "2022 - Álbum", cover: "https://i.scdn.co/image/ab67616d0000b273851222dc5c5681bd4c3119d3" },
      ]
    };
  }
};
</script>

<style scoped>
.artist-page {
  color: white;
  font-family: Arial, sans-serif;
  background: linear-gradient(30deg, black 80%, rgba(255, 81, 0, 0.8) 90%, #ff5100 100%);
  padding: 20px;
}
.header {
  position: relative;
}
.background-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
}
.artist-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
}
.verified {
  font-size: 14px;
  margin-bottom: 2px;
}

.artist-name {
  font-size: 48px;
  margin: 0;
}

.monthly-listeners {
  font-size: 16px;
  margin-top: 2px;
}

.popular-tracks {
  margin-top: 20px;
}
.track {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #333;
}
.track-number {
  width: 20px;
  font-weight: bold;
  color: #ff5100;
;
}
.track-image {
  width: 50px;
  border-radius: 10px;
  height: 50px;
  margin-right: 10px;
}
.track-title {
  flex-grow: 1;
}
.track-plays {
  margin-right: 20px;
}
.track-duration {
  text-align: right;
  opacity: 0.8;
}
.discography {
  margin-top: 20px;
}
.albums {
  display: flex;
  overflow-x: auto;
  gap: 20px;
  justify-content: center;
  padding: 20px;
}

.album {
  position: relative;
  text-align: center;
}

.album-cover {
  width: 240px; 
  height: 250px;
  border-radius: 10px;
  object-fit: cover; 
  background: rgba(0, 0, 0, 0.6);
}

.album-title {
  font-size: 12px; 
  color: white;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
}

.album-year {
  font-size: 10px;
  color: white;
  opacity: 0.8;
  margin: 0;
}
</style>
