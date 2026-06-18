import { cn, getScoreTier } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "../Accordion";

const ScoreBadge = ({ score }: { score: number }) => {
  const { bgColor, badgeTextClass, icon } = getScoreTier(score);

  return (
      <div
          className={cn(
              "flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px]",
              bgColor
          )}
      >
        <img src={icon} alt="score" className="size-4" />
        <p className={cn("text-sm font-medium", badgeTextClass)}>
          {score}/100
        </p>
      </div>
  );
};

const CategoryHeader = ({
                          title,
                          categoryScore,
                        }: {
  title: string;
  categoryScore: number;
}) => {
  return (
      <div className="flex flex-row gap-4 items-center py-2">
        <p className="text-2xl font-semibold">{title}</p>
        <ScoreBadge score={categoryScore} />
      </div>
  );
};

const CategoryContent = ({
                           tips,
                         }: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  return (
      <div className="flex flex-col gap-4 items-center w-full">
        <div className="bg-gray-50 w-full rounded-lg px-5 py-4 grid grid-cols-2 gap-4">
          {tips.map((tip, index) => (
              <div className="flex flex-row gap-2 items-center" key={index}>
                <img
                    src={
                      tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"
                    }
                    alt="score"
                    className="size-5"
                />
                <p className="text-xl text-gray-500 ">{tip.tip}</p>
              </div>
          ))}
        </div>
        <div className="flex flex-col gap-4 w-full">
          {tips.map((tip, index) => (
              <div
                  key={index + tip.tip}
                  className={cn(
                      "flex flex-col gap-2 rounded-2xl p-4",
                      tip.type === "good"
                          ? "bg-green-50 border border-green-200 text-green-700"
                          : "bg-yellow-50 border border-yellow-200 text-yellow-700"
                  )}
              >
                <div className="flex flex-row gap-2 items-center">
                  <img
                      src={
                        tip.type === "good"
                            ? "/icons/check.svg"
                            : "/icons/warning.svg"
                      }
                      alt="score"
                      className="size-5"
                  />
                  <p className="text-xl font-semibold">{tip.tip}</p>
                </div>
                <p>{tip.explanation}</p>
              </div>
          ))}
        </div>
      </div>
  );
};

const FEEDBACK_CATEGORIES: { id: string; title: string; key: keyof Omit<Feedback, "overallScore" | "ATS"> }[] = [
  { id: "tone-style", title: "Tone & Style", key: "toneAndStyle" },
  { id: "content", title: "Content", key: "content" },
  { id: "structure", title: "Structure", key: "structure" },
  { id: "skills", title: "Skills", key: "skills" },
];

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
      <div className="flex flex-col gap-4 w-full">
        <Accordion>
          {FEEDBACK_CATEGORIES.map(({ id, title, key }) => (
            <AccordionItem key={id} id={id}>
              <AccordionHeader itemId={id}>
                <CategoryHeader title={title} categoryScore={feedback[key].score} />
              </AccordionHeader>
              <AccordionContent itemId={id}>
                <CategoryContent tips={feedback[key].tips} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
  );
};

export default Details;
