export interface HandwrittenFormData {
  productInfo: string;
  tone: 'enthusiastic' | 'professional' | 'casual' | 'grateful';
  length: 'short' | 'medium' | 'long';
  aspects: string[];
  font: string;
  background: {
    style: 'classic' | 'notepad' | 'journal' | 'custom';
    color: string;
  };
  text: {
    color: string;
    size: number;
    lineHeight: number;
    includeSignature: boolean;
  };
}

export interface HandwrittenTestimonial {
  id: string;
  platform: 'handwritten';
  content: string;
  author: {
    name: string;
  };
  timestamp: Date;
  style: {
    font: string;
    background: {
      style: 'classic' | 'notepad' | 'journal' | 'custom';
      color: string;
    };
    text: {
      color: string;
      size: number;
      lineHeight: number;
    };
  };
}