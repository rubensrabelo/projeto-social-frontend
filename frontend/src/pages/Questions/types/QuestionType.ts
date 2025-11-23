export interface QuestionOptions {
  A: string;
  B: string;
  C: string;
  D: string;
}

export interface Question {
  id?: number | null;
  title: string;
  statement: string;
  year: string;
  bimester: string;
  subject: string;
  type: "multiple" | "essay" | "";
  options?: QuestionOptions;
  correct?: string;
  answer?: string;
  imageFile?: File;
  imagePreview?: string;
}
