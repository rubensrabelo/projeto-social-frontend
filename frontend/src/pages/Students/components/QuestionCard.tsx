// components/QuestionCard.tsx
import styles from "../AnswerExamPage.module.css";

interface Props {
  question: {
    id: number | null;
    enunciado: string;
    alternativa_a: string;
    alternativa_b: string;
    alternativa_c: string;
    alternativa_d: string;
    alternativa_e: string;
    correta: string;
  };
  selected?: string; // alternativa escolhida
  disabled: boolean;
  onSelect: (alt: string) => void;
  reviewMode?: boolean;
}

export default function QuestionCard({ question, selected, disabled, onSelect, reviewMode }: Props) {
  const alternativas = [
    { key: "a", texto: question.alternativa_a },
    { key: "b", texto: question.alternativa_b },
    { key: "c", texto: question.alternativa_c },
    { key: "d", texto: question.alternativa_d },
    { key: "e", texto: question.alternativa_e },
  ];

  const correctKey = alternativas.find(alt => alt.key === question.correta)?.key;

  return (
    <div className={styles.questionBox}>
      <p className={styles.questionText}>
        {question.enunciado}
      </p>

      {alternativas.map((alt) => {
        // classes para modo revisão
        let optionClass = styles.option;

        if (reviewMode) {
          if (alt.key === correctKey) {
            optionClass = `${styles.option} ${styles.correct}`;
          } else if (alt.key === selected && selected !== correctKey) {
            optionClass = `${styles.option} ${styles.incorrect}`;
          }
        }

        return (
          <label key={alt.key} className={optionClass}>
            <input
                type="radio"
                name={`q-${question.id}`}
                disabled = {disabled}
                checked={selected === alt.key}
                onChange={() => onSelect(alt.key)}
              />
            <span>{alt.texto}</span>
          </label>
        );
      })}
    </div>
  );
}