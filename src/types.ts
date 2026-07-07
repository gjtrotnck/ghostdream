export interface Post {
  id: string;
  title: string;
  author: string;
  date: string;
  views: number;
  likes: number;
  content: string;
  authorRank?: string;
  category?: string;
}

export interface Comment {
  id: string;
  author: string;
  avatarColor: string;
  content: string;
  date: string;
  isUser?: boolean;
  likes: number;
  dislikes?: number;
  isSpectral?: boolean;
  parentId?: string;
}

export interface Character {
  name: string;
  hanja: string;
  age: string;
  gender: string;
  mythologicalRole: string; // 🔒사방신(현무)
  body: string;
  appearance: string;
  clothing: string;
  abilities: string[];
  personalities: string[];
  likes: string[];
  dislikes: string[];
  sex: {
    position: string;
    tendency: string;
    preferences: string[];
  };
  past: string;
  avatarUrl?: string;
}

export interface Place {
  name: string;
  subtitle: string;
  location: string;
  description: string;
  details: string[];
  imagePrompt?: string;
  imageUrl?: string;
}
