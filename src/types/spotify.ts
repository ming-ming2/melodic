// types/spotify.ts
export interface SpotifySearchResult {
  id: string
  title: string
  artist: string
  albumName: string
  albumImageUrl: string
  previewUrl?: string
}

export interface SpotifyApiResponse {
  tracks: {
    items: Array<{
      id: string
      name: string
      artists: Array<{
        id: string
        name: string
      }>
      album: {
        name: string
        images: Array<{
          url: string
          height: number
          width: number
        }>
      }
      preview_url: string | null
    }>
  }
}

export interface SpotifyArtist {
  id: string
  name: string
  genres: string[]
  markets?: string[]
  popularity: number
  type: string
  uri: string
  external_urls: {
    spotify: string
  }
}
